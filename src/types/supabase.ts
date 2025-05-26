export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: number
          rut: string
          first_name: string
          last_name: string
          birth_date: string
          gender: string
          address: string | null
          phone: string | null
          email: string | null
          status: 'Activo' | 'Egresado' | 'Retirado'
          course_id: number | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      teachers: {
        Row: {
          id: number
          rut: string
          first_name: string
          last_name: string
          email: string | null
          active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['teachers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['teachers']['Insert']>
      }
      courses: {
        Row: {
          id: number
          name: string
          year: number
          level: string
          teacher_id: number | null
          school_id: number
          active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      schools: {
        Row: {
          id: number
          name: string
          address: string | null
          city: string | null
          phone: string | null
          email: string | null
          website: string | null
          director_name: string | null
          active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      attendance_stats: {
        Row: {
          id: number
          date: string
          present_count: number
          absent_count: number
          late_count: number
          attendance_rate: number
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['attendance_stats']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['attendance_stats']['Insert']>
      }
      enrollment_stats: {
        Row: {
          id: number
          month: string
          total_students: number
          new_enrollments: number
          withdrawals: number
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['enrollment_stats']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['enrollment_stats']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}