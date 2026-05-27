-- ============================================================
-- Make trigger functions SECURITY DEFINER so they bypass RLS
-- when running inside triggers (avaliacoes INSERT runs as anon)
-- ============================================================

ALTER FUNCTION fn_atualizar_indicadores() SECURITY DEFINER;
ALTER FUNCTION fn_totem_atualizar_estatisticas() SECURITY DEFINER;
ALTER FUNCTION fn_verifica_alertas() SECURITY DEFINER;
