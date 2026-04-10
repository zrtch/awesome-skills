#!/usr/bin/env python3
"""
Email Summarizer Skill
Résume les emails non lus et crée un briefing quotidien
"""

import json
import sys
from datetime import datetime

def summarize_emails(emails_data):
    """
    Analyse les emails et génère un résumé structuré
    
    Input: Liste d'emails avec metadata
    Output: Résumé catégorisé avec priorités
    """
    
    categories = {
        "urgent": [],
        "important": [],
        "newsletters": [],
        "social": [],
        "other": []
    }
    
    # Classification simple basée sur sujet/expéditeur
    for email in emails_data:
        subject = email.get("subject", "").lower()
        sender = email.get("sender", "").lower()
        
        # Urgent
        if any(word in subject for word in ["urgent", "asap", "deadline", "action required"]):
            categories["urgent"].append(email)
        # Important
        elif any(word in subject for word in ["meeting", "invoice", "payment", "contract"]):
            categories["important"].append(email)
        # Newsletters
        elif any(word in subject for word in ["newsletter", "digest", "weekly", "update"]):
            categories["newsletters"].append(email)
        # Social
        elif any(word in sender for word in ["linkedin", "twitter", "facebook", "instagram"]):
            categories["social"].append(email)
        else:
            categories["other"].append(email)
    
    return categories

def generate_briefing(categories):
    """Génère un briefing lisible pour l'utilisateur"""
    
    total = sum(len(v) for v in categories.values())
    
    briefing = []
    briefing.append("=" * 50)
    briefing.append(f"📧 BRIEFING EMAIL - {datetime.now().strftime('%H:%M')}")
    briefing.append("=" * 50)
    briefing.append(f"Total: {total} emails non lus")
    briefing.append("")
    
    # Urgent
    if categories["urgent"]:
        briefing.append(f"🚨 URGENT ({len(categories['urgent'])})")
        for email in categories["urgent"][:3]:
            briefing.append(f"  • {email.get('subject', 'N/A')}")
        briefing.append("")
    
    # Important
    if categories["important"]:
        briefing.append(f"📌 IMPORTANT ({len(categories['important'])})")
        for email in categories["important"][:5]:
            briefing.append(f"  • {email.get('subject', 'N/A')}")
        briefing.append("")
    
    # Newsletters
    if categories["newsletters"]:
        briefing.append(f"📰 NEWSLETTERS ({len(categories['newsletters'])})")
        briefing.append(f"  → {len(categories['newsletters'])} à lire ou archiver")
        briefing.append("")
    
    # Social
    if categories["social"]:
        briefing.append(f"👥 SOCIAL ({len(categories['social'])})")
        briefing.append(f"  → Notifications réseaux sociaux")
        briefing.append("")
    
    # Actions suggérées
    briefing.append("💡 ACTIONS SUGGÉRÉES:")
    if categories["urgent"]:
        briefing.append("  1. Traiter les emails URGENT immédiatement")
    if categories["important"]:
        briefing.append(f"  2. Réserver 15 min pour les {len(categories['important'])} emails importants")
    if categories["newsletters"]:
        briefing.append("  3. Lire ou archiver les newsletters ce soir")
    
    briefing.append("")
    briefing.append("=" * 50)
    
    return "\n".join(briefing)

def main():
    """Mode démonstration avec données fictives"""
    
    demo_emails = [
        {"subject": "URGENT: Deadline projet demain", "sender": "boss@company.com"},
        {"subject": "Meeting à 14h - Préparation", "sender": "assistant@company.com"},
        {"subject": "Weekly Newsletter #45", "sender": "newsletter@tech.com"},
        {"subject": "Votre facture est disponible", "sender": "billing@service.com"},
        {"subject": "John a commenté votre post", "sender": "notifications@linkedin.com"},
        {"subject": "Nouveau follower", "sender": "info@twitter.com"},
        {"subject": "Update système programmée", "sender": "it@company.com"},
    ]
    
    categories = summarize_emails(demo_emails)
    briefing = generate_briefing(categories)
    
    print(briefing)
    
    # Output JSON pour intégration
    print("\n---JSON---")
    print(json.dumps({
        "total": len(demo_emails),
        "categories": {k: len(v) for k, v in categories.items()},
        "urgent_count": len(categories["urgent"]),
        "action_required": len(categories["urgent"]) + len(categories["important"])
    }, indent=2))

if __name__ == "__main__":
    main()
