#!/usr/bin/env python3
"""
Smart Calendar Optimizer
Analyse le calendrier et suggère des optimisations
"""

import json
from datetime import datetime, timedelta

def analyze_calendar(events):
    """
    Analyse les événements et détecte des patterns problématiques
    """
    
    issues = []
    suggestions = []
    
    # Vérifier les back-to-back meetings
    sorted_events = sorted(events, key=lambda x: x.get("start", ""))
    
    for i in range(len(sorted_events) - 1):
        current_end = sorted_events[i].get("end")
        next_start = sorted_events[i + 1].get("start")
        
        if current_end and next_start:
            gap = parse_time(next_start) - parse_time(current_end)
            if gap < timedelta(minutes=5):
                issues.append({
                    "type": "back_to_back",
                    "event1": sorted_events[i]["title"],
                    "event2": sorted_events[i + 1]["title"],
                    "gap_minutes": gap.seconds // 60
                })
    
    # Vérifier les réunions sans objectif clair
    vague_terms = ["sync", "catch up", "discussion", "chat"]
    for event in events:
        title = event.get("title", "").lower()
        if any(term in title for term in vague_terms) and not event.get("description"):
            issues.append({
                "type": "no_agenda",
                "event": event["title"],
                "suggestion": "Ajouter un ordre du jour"
            })
    
    # Vérifier les réunions trop longues sans pause
    total_meeting_time = sum(
        (parse_time(e["end"]) - parse_time(e["start"])).seconds / 3600
        for e in events if e.get("start") and e.get("end")
    )
    
    if total_meeting_time > 4:
        suggestions.append(f"{total_meeting_time:.1f}h de réunions aujourd'hui - prévoir des pauses")
    
    # Suggérer des blocs de focus time
    if total_meeting_time > 3:
        suggestions.append("Bloquer 2h de focus time demain matin")
    
    return issues, suggestions, total_meeting_time

def parse_time(time_str):
    """Parse time string to datetime"""
    try:
        return datetime.fromisoformat(time_str.replace('Z', '+00:00'))
    except:
        return datetime.now()

def generate_report(issues, suggestions, total_hours):
    """Génère un rapport d'optimisation"""
    
    report = []
    report.append("=" * 50)
    report.append(f"📅 ANALYSE CALENDRIER - {datetime.now().strftime('%A %d %B')}")
    report.append("=" * 50)
    report.append(f"Total réunions: {total_hours:.1f} heures")
    report.append("")
    
    if issues:
        report.append("⚠️  PROBLÈMES DÉTECTÉS:")
        for issue in issues[:5]:
            if issue["type"] == "back_to_back":
                report.append(f"  • Back-to-back: {issue['event1']} → {issue['event2']}")
            elif issue["type"] == "no_agenda":
                report.append(f"  • Pas d'ordre du jour: {issue['event']}")
        report.append("")
    
    if suggestions:
        report.append("💡 SUGGESTIONS:")
        for suggestion in suggestions:
            report.append(f"  • {suggestion}")
        report.append("")
    
    # Optimisations automatiques
    report.append("🤖 OPTIMISATIONS POSSIBLES:")
    report.append("  1. Transformer les réunions 60min en 50min (buffer)")
    report.append("  2. Grouper les 1:1 dans le même créneau")
    report.append("  3. Bloquer 'No Meeting Wednesday'")
    report.append("")
    report.append("=" * 50)
    
    return "\n".join(report)

def main():
    """Mode démo"""
    
    demo_events = [
        {"title": "Daily Standup", "start": "2025-03-14T09:00:00", "end": "2025-03-14T09:30:00"},
        {"title": "Sync with Marketing", "start": "2025-03-14T09:30:00", "end": "2025-03-14T10:00:00", "description": ""},
        {"title": "Product Review", "start": "2025-03-14T10:00:00", "end": "2025-03-14T11:00:00"},
        {"title": "1:1 with John", "start": "2025-03-14T14:00:00", "end": "2025-03-14T14:30:00"},
        {"title": "Team Lunch", "start": "2025-03-14T12:30:00", "end": "2025-03-14T13:30:00"},
    ]
    
    issues, suggestions, total = analyze_calendar(demo_events)
    report = generate_report(issues, suggestions, total)
    
    print(report)

if __name__ == "__main__":
    main()
