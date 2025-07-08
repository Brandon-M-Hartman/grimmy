#!/usr/bin/env python3
import json
import os

def generate_nightorder():
    """Generate nightorder_first.json and nightorder_other.json from full_role_data.json"""
    
    # Read the full role data
    with open('C:\\Users\\bhartman\\git\\grimmy\\data\\full_role_data.json', 'r', encoding='utf-8') as f:
        full_data = json.load(f)
    
    # Setup items to insert after firstNight 18
    setup_items = [
        {
            "type": "setup",
            "role": None,
            "info": "If the game has 7 or more players:\nWake up the minions so that they can make eye contact with each other.\nShow the 'This is the Demon' card. Point to the Demon."
        },
        {
            "type": "setup",
            "role": None,
            "info": "If the game has 7 or more players:\nShow the 'These are your minions' card. Point to each Minion.\nShow the Demon Bluffs."
        }
    ]
    
    # Process roles for first night
    first_night_roles = []
    for role_data in full_data:
        if role_data.get('firstNight') and role_data.get('firstNightReminder'):
            first_night_roles.append({
                'order': role_data['firstNight'],
                'type': 'role',
                'role': role_data['id'],
                'info': role_data['firstNightReminder']
            })
    
    # Sort by first night order
    first_night_roles.sort(key=lambda x: x['order'])
    
    # Build first night order with setup items inserted just before the Yaggababble
    first_night_order = []
    for role in first_night_roles:
        if role['role'] == 'yaggababble':
            # Insert setup items before the Yaggababble
            first_night_order.extend(setup_items)
            first_night_order.append({
                'type': role['type'],
                'role': role['role'],
                'info': role['info']
            })
        else:
            first_night_order.append({
                'type': role['type'],
                'role': role['role'],
                'info': role['info']
            })
    
    
    # Process roles for other nights
    other_night_roles = []
    for role_data in full_data:
        if role_data.get('otherNight') and role_data.get('otherNightReminder'):
            other_night_roles.append({
                'order': role_data['otherNight'],
                'type': 'role',
                'role': role_data['id'],
                'info': role_data['otherNightReminder']
            })
    
    # Sort by other night order
    other_night_roles.sort(key=lambda x: x['order'])
    
    # Build other night order
    other_night_order = []
    for role in other_night_roles:
        other_night_order.append({
            'type': role['type'],
            'role': role['role'],
            'info': role['info']
        })
    
    # Write first night order
    with open('C:\\Users\\bhartman\\git\\grimmy\\data\\nightorder_first_new.json', 'w', encoding='utf-8') as f:
        json.dump(first_night_order, f, indent=2, ensure_ascii=False)
    
    # Write other night order
    with open('C:\\Users\\bhartman\\git\\grimmy\\data\\nightorder_other_new.json', 'w', encoding='utf-8') as f:
        json.dump(other_night_order, f, indent=2, ensure_ascii=False)
    
    print(f"Generated nightorder_first.json with {len(first_night_order)} entries")
    print(f"Generated nightorder_other.json with {len(other_night_order)} entries")
    
    # Print summary
    first_night_roles_count = len([item for item in first_night_order if item['type'] == 'role'])
    setup_count = len([item for item in first_night_order if item['type'] == 'setup'])
    other_night_roles_count = len(other_night_order)
    
    print(f"First night summary:")
    print(f"  Role entries: {first_night_roles_count}")
    print(f"  Setup entries: {setup_count}")
    print(f"Other night summary:")
    print(f"  Role entries: {other_night_roles_count}")

if __name__ == '__main__':
    try:
        generate_nightorder()
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Make sure full_role_data.json exists in the current directory")
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
