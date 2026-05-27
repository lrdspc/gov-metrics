CREATE OR REPLACE FUNCTION fn_verifica_alertas()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r_alertas RECORD;
  v_satisfacao NUMERIC(5,2);
  v_total_avaliacoes INTEGER;
  v_metrica TEXT;
  v_operador TEXT;
  v_valor_limite NUMERIC(10,2);
  v_condicoes JSONB;
  v_disparado BOOLEAN;
BEGIN
  FOR r_alertas IN
    SELECT *
    FROM alertas_config
    WHERE ativo = true
      AND deleted_at IS NULL
      AND (unidade_id IS NULL OR unidade_id = NEW.unidade_id)
  LOOP
    v_condicoes := r_alertas.condicoes;
    v_metrica := v_condicoes->>'metrica';
    v_operador := v_condicoes->>'operador';
    v_valor_limite := (v_condicoes->>'valor')::NUMERIC;

    IF r_alertas.ultima_disparado_em IS NOT NULL
       AND (NOW() - r_alertas.ultima_disparado_em) < r_alertas.intervalo_cooldown THEN
      CONTINUE;
    END IF;

    v_disparado := false;

    IF v_metrica = 'satisfacao' THEN
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE nota IN ('excellent', 'good'))::NUMERIC / GREATEST(COUNT(*), 1)) * 100, 2
      ) INTO v_satisfacao
      FROM avaliacoes
      WHERE unidade_id = NEW.unidade_id
        AND deleted_at IS NULL;

      CASE v_operador
        WHEN 'lt' THEN v_disparado := v_satisfacao < v_valor_limite;
        WHEN 'gt' THEN v_disparado := v_satisfacao > v_valor_limite;
        WHEN 'lte' THEN v_disparado := v_satisfacao <= v_valor_limite;
        WHEN 'gte' THEN v_disparado := v_satisfacao >= v_valor_limite;
      END CASE;

      IF v_disparado THEN
        INSERT INTO alertas_historico (alerta_config_id, municipio_id, status, mensagem, metrica_disparada, valor_apurado, valor_limite)
        VALUES (
          r_alertas.id, NEW.municipio_id, 'triggered',
          format('Alerta %s: Satisfacao %s%% (limite: %s%%)', r_alertas.nome, v_satisfacao, v_valor_limite),
          v_condicoes, v_satisfacao, v_valor_limite
        );
        UPDATE alertas_config SET ultima_disparado_em = NOW() WHERE id = r_alertas.id;
      END IF;

    ELSIF v_metrica = 'avaliacoes' THEN
      SELECT COUNT(*) INTO v_total_avaliacoes
      FROM avaliacoes
      WHERE unidade_id = NEW.unidade_id
        AND deleted_at IS NULL
        AND created_at >= NOW() - INTERVAL '24 hours';

      CASE v_operador
        WHEN 'lt' THEN v_disparado := v_total_avaliacoes < v_valor_limite;
        WHEN 'gt' THEN v_disparado := v_total_avaliacoes > v_valor_limite;
        WHEN 'lte' THEN v_disparado := v_total_avaliacoes <= v_valor_limite;
        WHEN 'gte' THEN v_disparado := v_total_avaliacoes >= v_valor_limite;
      END CASE;

      IF v_disparado THEN
        INSERT INTO alertas_historico (alerta_config_id, municipio_id, status, mensagem, metrica_disparada, valor_apurado, valor_limite)
        VALUES (
          r_alertas.id, NEW.municipio_id, 'triggered',
          format('Alerta %s: %s avaliacoes (limite: %s)', r_alertas.nome, v_total_avaliacoes, v_valor_limite),
          v_condicoes, v_total_avaliacoes, v_valor_limite
        );
        UPDATE alertas_config SET ultima_disparado_em = NOW() WHERE id = r_alertas.id;
      END IF;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_avaliacoes_verifica_alertas ON avaliacoes;
CREATE TRIGGER trg_avaliacoes_verifica_alertas
  AFTER INSERT ON avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION fn_verifica_alertas();
