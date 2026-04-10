# Email Summarizer Pro

## Résumé
Skill OpenClaw qui récupère vos emails via IMAP et génère un briefing quotidien inteligent.

## Fonctionnalités
- Connexion IMAP (Gmail, Outlook, Proton, etc.)
- Classification automatique (urgent/important/newsletters/social)
- Résumé par catégorie avec优先级
- Actions suggérées basées sur le contenu
- Intégration cron pour briefing quotidien

## Installation
```bash
# Installer himalaya pour IMAP
npm i -g himalaya

# Configurer le skill dans OpenClaw
cp email-summarizer.py /path/to/skills/
```

## Configuration
```python
IMAP_CONFIG = {
    "host": "imap.gmail.com",
    "port": 993,
    "user": "votre@email.com",
    "password": "mot_de_passe_app"  # ou App Password
}
```

## Usage
```bash
python email-summarizer.py
```

## Exemple de sortie
```
📧 BRIEFING EMAIL - 08:00
=========================
Total: 15 emails non lus

🚨 URGENT (2)
  • URGENT: Deadline projet demain
  • Action requise: Revue de contrat

📌 IMPORTANT (5)
  • Meeting à 14h
  • Facture à payer
  
💡 ACTIONS:
  1. Traiter les urgent immédiatement
  2. Réserver 15 min pour les importants
```

## Prix
- **Version basique:** Offerte (classification simple)
- **Pro (5€):** Classification IA, réponses suggérées, intégrations Slack/Discord

## Dépendances
- Python 3.8+
- himalaya (npm)
- Configuration IMAP valide
