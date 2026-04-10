# Calendar Optimizer Pro

## Résumé
Skill OpenClaw qui analyse votre calendrier et optimise votre journée automatiquement.

## Fonctionnalités
- Connexion CalDAV (Google Calendar, Outlook, Nextcloud)
- Analyse des créneaux disponibles
- Suggestion d'optimisation des réunions
- Identification des trous pour du travail profond
- Équilibre réunion/travail calculé

## Installation
```bash
# Configurer via OpenClaw
cp -r calendar-optimizer/ /path/to/skills/
```

## Configuration
```python
CALENDAR_CONFIG = {
    "provider": "google",  # google, outlook, nextcloud
    "client_id": "xxx",
    "client_secret": "xxx",
    "calendar_id": "primary"
}
```

## Usage
```bash
python skill.py --analyze today
```

## Exemple de sortie
```
📅 OPTIMISATION JOURNÉE - 14 Mars
=================================
Réunions: 4 (3h15)
Travail profond disponible: 2h45

💡 SUGGESTIONS:
  • 10:00-11:00 Réunion déjà longue (60min) → proposé de réduire à 30min
  • 14:00-16:00 Bloc travail → idéal pour tâche complexe
  • Trou 16:30-17:30 → perfect pour emails/tâches admin

⚖️ ÉQUILIBRE:
  Réunions: 57% ← ⚠️ Trop élevé
  Travail: 43% ← ✅ Bon

🎯 RECOMMANDATION:
  Bloquer 9:00-10:00 pour travail profond demain
```

## Prix
- **Version basique:** Offerte (analyse simple)
- **Pro (5€):** Intégration IA, suggestions automatiques, alertes事先

## Dépendances
- Python 3.8+
- caldav (pip install caldav)
- Accès API calendar
