-- ============================================================
-- TOTEM MANAGEMENT
-- ============================================================

CREATE TYPE totem_status AS ENUM ('online', 'offline', 'disabled');

CREATE TABLE totens (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipio_id      UUID NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
  unidade_id        UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  setor_id          UUID REFERENCES setores(id) ON DELETE SET NULL,
  nome              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  localizacao       TEXT,
  status            totem_status NOT NULL DEFAULT 'offline',
  ultimo_heartbeat  TIMESTAMPTZ,
  total_avaliacoes  INTEGER NOT NULL DEFAULT 0,
  ultima_avaliacao_em TIMESTAMPTZ,
  criado_por        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_totens_municipio ON totens(municipio_id);
CREATE INDEX idx_totens_unidade ON totens(unidade_id);
CREATE INDEX idx_totens_slug ON totens(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_totens_ativo ON totens(ativo) WHERE ativo = TRUE;
CREATE INDEX idx_totens_deleted ON totens(deleted_at) WHERE deleted_at IS NULL;

-- Add totem_id to avaliacoes
ALTER TABLE avaliacoes ADD COLUMN totem_id UUID REFERENCES totens(id) ON DELETE SET NULL;
CREATE INDEX idx_avaliacoes_totem ON avaliacoes(totem_id, created_at);

-- ============================================================
-- RLS: TOTENS
-- ============================================================
ALTER TABLE totens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "totens_admin_all" ON totens
  FOR ALL USING (fn_usuario_papel() = 'admin');

CREATE POLICY "totens_gestor" ON totens
  FOR ALL USING (
    fn_usuario_papel() = 'gestor'
    AND municipio_id = fn_usuario_municipio()
  );

CREATE POLICY "totens_anon_select" ON totens
  FOR SELECT USING (auth.role() = 'anon' AND ativo = TRUE AND deleted_at IS NULL);

CREATE POLICY "totens_anon_update_heartbeat" ON totens
  FOR UPDATE USING (auth.role() = 'anon' AND ativo = TRUE AND deleted_at IS NULL)
  WITH CHECK (auth.role() = 'anon' AND ativo = TRUE AND deleted_at IS NULL);

-- ============================================================
-- FIX: Allow anon to insert comments
-- ============================================================
CREATE POLICY "comentarios_anon_insert" ON comentarios
  FOR INSERT WITH CHECK (auth.role() = 'anon');

-- ============================================================
-- FUNCTION: Update totem stats after evaluation
-- ============================================================
CREATE OR REPLACE FUNCTION fn_totem_atualizar_estatisticas()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.totem_id IS NOT NULL THEN
    UPDATE totens
    SET
      total_avaliacoes = total_avaliacoes + 1,
      ultima_avaliacao_em = NOW(),
      updated_at = NOW()
    WHERE id = NEW.totem_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_totem_atualizar_estatisticas
  AFTER INSERT ON avaliacoes
  FOR EACH ROW
  WHEN (NEW.totem_id IS NOT NULL)
  EXECUTE FUNCTION fn_totem_atualizar_estatisticas();

-- ============================================================
-- FUNCTION: Heartbeat (called by totem clients)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_totem_heartbeat(p_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_totem totens%ROWTYPE;
BEGIN
  UPDATE totens
  SET
    status = 'online',
    ultimo_heartbeat = NOW(),
    updated_at = NOW()
  WHERE slug = p_slug
    AND ativo = TRUE
    AND deleted_at IS NULL
  RETURNING * INTO v_totem;

  IF v_totem.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Totem nao encontrado');
  END IF;

  RETURN jsonb_build_object('success', true, 'totem_id', v_totem.id);
END;
$$;

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY totens;
