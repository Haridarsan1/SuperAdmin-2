export type UserRole = "SUPERADMIN" | "MANAGER" | "EMPLOYEE"
export type ProjectRole = "LEAD" | "DEVELOPER" | "TESTER" | "DESIGNER"
export type ProjectStatus = "active" | "paused" | "completed" | "archived"
export type UpdateType = "commit" | "deployment" | "bug_fix" | "feature" | "meeting" | "milestone" | "other"
export type UpdateSource = "manual" | "github" | "gitlab" | "bitbucket" | "jira" | "webhook"

export interface Profile {
  id: string
  email: string
  username: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: UserRole
  department: string | null
  position: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  repository_url: string | null
  project_type: string | null
  status: ProjectStatus
  manager_id: string | null
  created_at: string
  updated_at: string
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: ProjectRole
  joined_at: string
}

export interface ProjectUpdate {
  id: string
  project_id: string
  user_id: string
  title: string
  description: string | null
  update_type: UpdateType
  source: UpdateSource
  metadata: Record<string, any> | null
  created_at: string
}

export interface ProjectCommit {
  id: string
  project_id: string
  user_id: string | null
  commit_hash: string
  commit_message: string | null
  author_email: string | null
  author_name: string | null
  branch: string | null
  files_changed: number
  additions: number
  deletions: number
  committed_at: string
  synced_at: string
}

export interface Webhook {
  id: string
  project_id: string
  name: string
  webhook_url: string
  secret_key: string
  service_type: "github" | "gitlab" | "bitbucket" | "custom"
  is_active: boolean
  created_at: string
  last_triggered_at: string | null
}

export interface LoginActivity {
  id: string
  user_id: string
  ip_address: string | null
  device_info: string | null
  location: string | null
  success: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string | null
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS"
  link: string | null
  read: boolean
  created_at: string
}
