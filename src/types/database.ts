export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      alertas_config: {
        Row: {
          ativo: boolean
          condicoes: Json
          created_at: string
          deleted_at: string | null
          descricao: string | null
          id: string
          intervalo_cooldown: string
          municipio_id: string
          nome: string
          notificar_para: Json | null
          notificar_por: string[]
          secretaria_id: string | null
          severidade: Database["public"]["Enums"]["alerta_severidade"]
          ultima_disparado_em: string | null
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          condicoes: Json
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          intervalo_cooldown?: string
          municipio_id: string
          nome: string
          notificar_para?: Json | null
          notificar_por?: string[]
          secretaria_id?: string | null
          severidade?: Database["public"]["Enums"]["alerta_severidade"]
          ultima_disparado_em?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          condicoes?: Json
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          intervalo_cooldown?: string
          municipio_id?: string
          nome?: string
          notificar_para?: Json | null
          notificar_por?: string[]
          secretaria_id?: string | null
          severidade?: Database["public"]["Enums"]["alerta_severidade"]
          ultima_disparado_em?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_config_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_config_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_config_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      alertas_historico: {
        Row: {
          alerta_config_id: string
          created_at: string
          id: string
          mensagem: string
          metrica_disparada: Json
          municipio_id: string
          reconhecido_em: string | null
          reconhecido_por: string | null
          resolvido_em: string | null
          resolvido_por: string | null
          status: Database["public"]["Enums"]["alerta_status"]
          valor_apurado: number | null
          valor_limite: number | null
        }
        Insert: {
          alerta_config_id: string
          created_at?: string
          id?: string
          mensagem: string
          metrica_disparada: Json
          municipio_id: string
          reconhecido_em?: string | null
          reconhecido_por?: string | null
          resolvido_em?: string | null
          resolvido_por?: string | null
          status?: Database["public"]["Enums"]["alerta_status"]
          valor_apurado?: number | null
          valor_limite?: number | null
        }
        Update: {
          alerta_config_id?: string
          created_at?: string
          id?: string
          mensagem?: string
          metrica_disparada?: Json
          municipio_id?: string
          reconhecido_em?: string | null
          reconhecido_por?: string | null
          resolvido_em?: string | null
          resolvido_por?: string | null
          status?: Database["public"]["Enums"]["alerta_status"]
          valor_apurado?: number | null
          valor_limite?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alertas_historico_alerta_config_id_fkey"
            columns: ["alerta_config_id"]
            isOneToOne: false
            referencedRelation: "alertas_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_historico_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          acao: string
          created_at: string
          entidade_id: string | null
          entidade_tipo: string
          id: string
          ip_origem: unknown
          municipio_id: string | null
          user_agent: string | null
          user_id: string | null
          valores_antigos: Json | null
          valores_novos: Json | null
        }
        Insert: {
          acao: string
          created_at?: string
          entidade_id?: string | null
          entidade_tipo: string
          id?: string
          ip_origem?: unknown
          municipio_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          valores_antigos?: Json | null
          valores_novos?: Json | null
        }
        Update: {
          acao?: string
          created_at?: string
          entidade_id?: string | null
          entidade_tipo?: string
          id?: string
          ip_origem?: unknown
          municipio_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          valores_antigos?: Json | null
          valores_novos?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          canal: string
          cpf_hash: string | null
          created_at: string
          deleted_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          municipio_id: string
          nota: Database["public"]["Enums"]["avaliacao_nota"]
          pontuacao: number
          secretaria_id: string
          session_id: string | null
          setor_id: string | null
          totem_id: string | null
          unidade_id: string
          user_id: string | null
        }
        Insert: {
          canal?: string
          cpf_hash?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipio_id: string
          nota: Database["public"]["Enums"]["avaliacao_nota"]
          pontuacao?: number
          secretaria_id: string
          session_id?: string | null
          setor_id?: string | null
          totem_id?: string | null
          unidade_id: string
          user_id?: string | null
        }
        Update: {
          canal?: string
          cpf_hash?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipio_id?: string
          nota?: Database["public"]["Enums"]["avaliacao_nota"]
          pontuacao?: number
          secretaria_id?: string
          session_id?: string | null
          setor_id?: string | null
          totem_id?: string | null
          unidade_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_totem_id_fkey"
            columns: ["totem_id"]
            isOneToOne: false
            referencedRelation: "totens"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes_default: {
        Row: {
          canal: string
          cpf_hash: string | null
          created_at: string
          deleted_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          municipio_id: string
          nota: Database["public"]["Enums"]["avaliacao_nota"]
          pontuacao: number
          secretaria_id: string
          session_id: string | null
          setor_id: string | null
          totem_id: string | null
          unidade_id: string
          user_id: string | null
        }
        Insert: {
          canal?: string
          cpf_hash?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipio_id: string
          nota: Database["public"]["Enums"]["avaliacao_nota"]
          pontuacao?: number
          secretaria_id: string
          session_id?: string | null
          setor_id?: string | null
          totem_id?: string | null
          unidade_id: string
          user_id?: string | null
        }
        Update: {
          canal?: string
          cpf_hash?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipio_id?: string
          nota?: Database["public"]["Enums"]["avaliacao_nota"]
          pontuacao?: number
          secretaria_id?: string
          session_id?: string | null
          setor_id?: string | null
          totem_id?: string | null
          unidade_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      comentarios: {
        Row: {
          anonimo: boolean
          avaliacao_id: string | null
          comentario: string
          created_at: string
          curtidas: number
          deleted_at: string | null
          id: string
          moderado: boolean
          moderado_em: string | null
          moderado_por: string | null
          municipio_id: string
          score_sentimento: number | null
          secretaria_id: string
          sentimento: Database["public"]["Enums"]["sentimento"]
          setor_id: string | null
          unidade_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          anonimo?: boolean
          avaliacao_id?: string | null
          comentario: string
          created_at?: string
          curtidas?: number
          deleted_at?: string | null
          id?: string
          moderado?: boolean
          moderado_em?: string | null
          moderado_por?: string | null
          municipio_id: string
          score_sentimento?: number | null
          secretaria_id: string
          sentimento?: Database["public"]["Enums"]["sentimento"]
          setor_id?: string | null
          unidade_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          anonimo?: boolean
          avaliacao_id?: string | null
          comentario?: string
          created_at?: string
          curtidas?: number
          deleted_at?: string | null
          id?: string
          moderado?: boolean
          moderado_em?: string | null
          moderado_por?: string | null
          municipio_id?: string
          score_sentimento?: number | null
          secretaria_id?: string
          sentimento?: Database["public"]["Enums"]["sentimento"]
          setor_id?: string | null
          unidade_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      indicadores_materializados: {
        Row: {
          created_at: string
          id: string
          intervalo: string
          media_pontuacao: number | null
          municipio_id: string | null
          nivel: string
          periodo_fim: string
          periodo_inicio: string
          satisfacao_bruta: number | null
          secretaria_id: string | null
          setor_id: string | null
          total_avaliacoes: number
          total_bad: number
          total_comentarios: number
          total_excellent: number
          total_good: number
          total_negativos: number
          total_positivos: number
          total_regular: number
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          intervalo: string
          media_pontuacao?: number | null
          municipio_id?: string | null
          nivel: string
          periodo_fim: string
          periodo_inicio: string
          satisfacao_bruta?: number | null
          secretaria_id?: string | null
          setor_id?: string | null
          total_avaliacoes?: number
          total_bad?: number
          total_comentarios?: number
          total_excellent?: number
          total_good?: number
          total_negativos?: number
          total_positivos?: number
          total_regular?: number
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          intervalo?: string
          media_pontuacao?: number | null
          municipio_id?: string | null
          nivel?: string
          periodo_fim?: string
          periodo_inicio?: string
          satisfacao_bruta?: number | null
          secretaria_id?: string | null
          setor_id?: string | null
          total_avaliacoes?: number
          total_bad?: number
          total_comentarios?: number
          total_excellent?: number
          total_good?: number
          total_negativos?: number
          total_positivos?: number
          total_regular?: number
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicadores_materializados_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicadores_materializados_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicadores_materializados_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicadores_materializados_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      indicadores_publicos: {
        Row: {
          comentarios_negativos: number
          comentarios_positivos: number
          id: string
          media_geral: number | null
          mes_referencia: string
          municipio_id: string
          satisfacao_percentual: number | null
          secretaria_id: string | null
          tendencia: string | null
          total_avaliacoes: number
          total_comentarios: number
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          comentarios_negativos?: number
          comentarios_positivos?: number
          id?: string
          media_geral?: number | null
          mes_referencia: string
          municipio_id: string
          satisfacao_percentual?: number | null
          secretaria_id?: string | null
          tendencia?: string | null
          total_avaliacoes?: number
          total_comentarios?: number
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          comentarios_negativos?: number
          comentarios_positivos?: number
          id?: string
          media_geral?: number | null
          mes_referencia?: string
          municipio_id?: string
          satisfacao_percentual?: number | null
          secretaria_id?: string | null
          tendencia?: string | null
          total_avaliacoes?: number
          total_comentarios?: number
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicadores_publicos_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicadores_publicos_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicadores_publicos_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      municipios: {
        Row: {
          ativo: boolean
          codigo_ibge: string
          created_at: string
          deleted_at: string | null
          id: string
          nome: string
          populacao: number | null
          uf: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo_ibge: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          nome: string
          populacao?: number | null
          uf: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo_ibge?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          nome?: string
          populacao?: number | null
          uf?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          municipio_id: string | null
          nome: string
          papel: Database["public"]["Enums"]["user_role"]
          secretaria_id: string | null
          setor_id: string | null
          telefone: string | null
          ultimo_acesso: string | null
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          id: string
          municipio_id?: string | null
          nome: string
          papel?: Database["public"]["Enums"]["user_role"]
          secretaria_id?: string | null
          setor_id?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          municipio_id?: string | null
          nome?: string
          papel?: Database["public"]["Enums"]["user_role"]
          secretaria_id?: string | null
          setor_id?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_config: {
        Row: {
          created_at: string
          criar_publico: boolean
          deleted_at: string | null
          descricao: string | null
          formato: Database["public"]["Enums"]["relatorio_formato"]
          gerar_automaticamente: boolean
          id: string
          inclui_comentarios: boolean
          inclui_evolucao: boolean
          inclui_graficos: boolean
          municipio_id: string
          nome: string
          notificar_ao_gerar: boolean
          parametros: Json
          periodicidade: string | null
          secretaria_id: string | null
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          criar_publico?: boolean
          deleted_at?: string | null
          descricao?: string | null
          formato?: Database["public"]["Enums"]["relatorio_formato"]
          gerar_automaticamente?: boolean
          id?: string
          inclui_comentarios?: boolean
          inclui_evolucao?: boolean
          inclui_graficos?: boolean
          municipio_id: string
          nome: string
          notificar_ao_gerar?: boolean
          parametros?: Json
          periodicidade?: string | null
          secretaria_id?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          criar_publico?: boolean
          deleted_at?: string | null
          descricao?: string | null
          formato?: Database["public"]["Enums"]["relatorio_formato"]
          gerar_automaticamente?: boolean
          id?: string
          inclui_comentarios?: boolean
          inclui_evolucao?: boolean
          inclui_graficos?: boolean
          municipio_id?: string
          nome?: string
          notificar_ao_gerar?: boolean
          parametros?: Json
          periodicidade?: string | null
          secretaria_id?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_config_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_config_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_config_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_gerados: {
        Row: {
          config_id: string
          created_at: string
          erro_mensagem: string | null
          formato: Database["public"]["Enums"]["relatorio_formato"]
          gerado_por: string | null
          id: string
          municipio_id: string
          parametros_usados: Json | null
          status: Database["public"]["Enums"]["relatorio_status"]
          storage_path: string | null
          tamanho_bytes: number | null
          url_publico: string | null
        }
        Insert: {
          config_id: string
          created_at?: string
          erro_mensagem?: string | null
          formato: Database["public"]["Enums"]["relatorio_formato"]
          gerado_por?: string | null
          id?: string
          municipio_id: string
          parametros_usados?: Json | null
          status?: Database["public"]["Enums"]["relatorio_status"]
          storage_path?: string | null
          tamanho_bytes?: number | null
          url_publico?: string | null
        }
        Update: {
          config_id?: string
          created_at?: string
          erro_mensagem?: string | null
          formato?: Database["public"]["Enums"]["relatorio_formato"]
          gerado_por?: string | null
          id?: string
          municipio_id?: string
          parametros_usados?: Json | null
          status?: Database["public"]["Enums"]["relatorio_status"]
          storage_path?: string | null
          tamanho_bytes?: number | null
          url_publico?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_gerados_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "relatorios_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_gerados_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      secretarias: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          municipio_id: string
          nome: string
          responsavel: string | null
          sigla: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          municipio_id: string
          nome: string
          responsavel?: string | null
          sigla?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          municipio_id?: string
          nome?: string
          responsavel?: string | null
          sigla?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "secretarias_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      setores: {
        Row: {
          created_at: string
          deleted_at: string | null
          descricao: string | null
          id: string
          municipio_id: string
          nome: string
          unidade_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          municipio_id: string
          nome: string
          unidade_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          municipio_id?: string
          nome?: string
          unidade_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "setores_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setores_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      totens: {
        Row: {
          ativo: boolean
          created_at: string
          criado_por: string | null
          deleted_at: string | null
          id: string
          localizacao: string | null
          municipio_id: string
          nome: string
          setor_id: string | null
          slug: string
          status: Database["public"]["Enums"]["totem_status"]
          total_avaliacoes: number
          ultima_avaliacao_em: string | null
          ultimo_heartbeat: string | null
          unidade_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          criado_por?: string | null
          deleted_at?: string | null
          id?: string
          localizacao?: string | null
          municipio_id: string
          nome: string
          setor_id?: string | null
          slug: string
          status?: Database["public"]["Enums"]["totem_status"]
          total_avaliacoes?: number
          ultima_avaliacao_em?: string | null
          ultimo_heartbeat?: string | null
          unidade_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          criado_por?: string | null
          deleted_at?: string | null
          id?: string
          localizacao?: string | null
          municipio_id?: string
          nome?: string
          setor_id?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["totem_status"]
          total_avaliacoes?: number
          ultima_avaliacao_em?: string | null
          ultimo_heartbeat?: string | null
          unidade_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "totens_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "totens_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "totens_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades: {
        Row: {
          ativa: boolean
          created_at: string
          deleted_at: string | null
          endereco: string | null
          horario_funcionamento: string | null
          id: string
          latitude: number | null
          longitude: number | null
          municipio_id: string
          nome: string
          secretaria_id: string
          telefone: string | null
          tipo: Database["public"]["Enums"]["unidade_tipo"]
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          deleted_at?: string | null
          endereco?: string | null
          horario_funcionamento?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipio_id: string
          nome: string
          secretaria_id: string
          telefone?: string | null
          tipo: Database["public"]["Enums"]["unidade_tipo"]
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          deleted_at?: string | null
          endereco?: string | null
          horario_funcionamento?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          municipio_id?: string
          nome?: string
          secretaria_id?: string
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["unidade_tipo"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidades_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unidades_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_distribuicao_notas: {
        Args: never
        Returns: {
          nota: string
          total: number
        }[]
      }
      fn_evolucao_satisfacao: {
        Args: never
        Returns: {
          periodo: string
          satisfacao: number
          total: number
        }[]
      }
      fn_ranking_unidades: {
        Args: never
        Returns: {
          media: number
          satisfacao: number
          tipo: string
          total: number
          unidade_id: string
          unidade_nome: string
        }[]
      }
      fn_totem_heartbeat: { Args: { p_slug: string }; Returns: Json }
      fn_usuario_municipio: { Args: never; Returns: string }
      fn_usuario_papel: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      alerta_severidade: "low" | "medium" | "high" | "critical"
      alerta_status:
        | "active"
        | "triggered"
        | "acknowledged"
        | "resolved"
        | "disabled"
      avaliacao_nota: "excellent" | "good" | "regular" | "bad"
      relatorio_formato: "pdf" | "xlsx" | "csv" | "json"
      relatorio_status: "pending" | "generating" | "completed" | "failed"
      sentimento: "positive" | "neutral" | "negative" | "mixed" | "not_analyzed"
      totem_status: "online" | "offline" | "disabled"
      unidade_tipo:
        | "upa"
        | "ubs"
        | "hospital"
        | "escola"
        | "creche"
        | "centro_esportivo"
        | "centro_cultural"
        | "orgao_publico"
        | "outro"
      user_role: "admin" | "gestor" | "operador" | "cidadao"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      alerta_severidade: ["low", "medium", "high", "critical"],
      alerta_status: [
        "active",
        "triggered",
        "acknowledged",
        "resolved",
        "disabled",
      ],
      avaliacao_nota: ["excellent", "good", "regular", "bad"],
      relatorio_formato: ["pdf", "xlsx", "csv", "json"],
      relatorio_status: ["pending", "generating", "completed", "failed"],
      sentimento: ["positive", "neutral", "negative", "mixed", "not_analyzed"],
      totem_status: ["online", "offline", "disabled"],
      unidade_tipo: [
        "upa",
        "ubs",
        "hospital",
        "escola",
        "creche",
        "centro_esportivo",
        "centro_cultural",
        "orgao_publico",
        "outro",
      ],
      user_role: ["admin", "gestor", "operador", "cidadao"],
    },
  },
} as const
