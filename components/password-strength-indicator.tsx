"use client"

import { useEffect, useState } from "react"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<"weak" | "medium" | "strong" | "very-strong" | null>(null)
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    }

    setRequirements(newRequirements)

    const metRequirements = Object.values(newRequirements).filter(Boolean).length

    if (password.length === 0) {
      setStrength(null)
    } else if (metRequirements <= 2) {
      setStrength("weak")
    } else if (metRequirements === 3) {
      setStrength("medium")
    } else if (metRequirements === 4) {
      setStrength("strong")
    } else {
      setStrength("very-strong")
    }
  }, [password])

  if (!password) return null

  const strengthColors = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-blue-500",
    "very-strong": "bg-green-500",
  }

  const strengthLabels = {
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    "very-strong": "Very Strong",
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              strength && ["weak", "medium", "strong", "very-strong"].indexOf(strength) >= i
                ? strengthColors[strength]
                : "bg-slate-700"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400">
        Password strength:{" "}
        <span className="text-slate-200 font-medium">{strength ? strengthLabels[strength] : ""}</span>
      </p>
      <div className="space-y-1">
        <RequirementItem met={requirements.length} label="At least 8 characters" />
        <RequirementItem met={requirements.uppercase} label="One uppercase letter" />
        <RequirementItem met={requirements.lowercase} label="One lowercase letter" />
        <RequirementItem met={requirements.number} label="One number" />
        <RequirementItem met={requirements.special} label="One special character" />
      </div>
    </div>
  )
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-3 h-3 rounded-full ${met ? "bg-green-500" : "bg-slate-700"}`} />
      <span className={met ? "text-green-400" : "text-slate-400"}>{label}</span>
    </div>
  )
}
