# Setting Up Guardrails & Safety Filters in Azure OpenAI  
**Step-by-Step Guide (README Format)**

This guide explains how to configure **Guardrails and Safety Filters** for **Azure OpenAI** to ensure secure, responsible, and enterprise-ready Generative AI applications.

---

## 📌 What Are Guardrails in Azure OpenAI?

Guardrails are safety and control mechanisms that help you:

- Prevent harmful or disallowed content
- Control jailbreak attempts and prompt injection
- Enforce enterprise compliance and responsible AI policies
- Monitor and audit LLM usage

Azure OpenAI provides guardrails through:
- **Content Safety Filters**
- **System & Developer Prompts**
- **Azure AI Content Safety**
- **Network & Identity Controls**
- **Observability & Logging**

---

## 🧱 Guardrail Layers (Recommended Architecture)

```text
User Input
   ↓
Prompt Guardrails (System Prompt)
   ↓
Azure OpenAI Content Filters
   ↓
Azure AI Content Safety (Optional Advanced Layer)
   ↓
Application Logic Validation
   ↓
User Response
