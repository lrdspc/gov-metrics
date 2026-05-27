CREATE POLICY "unidades_anon_select" ON unidades
  FOR SELECT USING (auth.role() = 'anon');

CREATE POLICY "setores_anon_select" ON setores
  FOR SELECT USING (auth.role() = 'anon');
