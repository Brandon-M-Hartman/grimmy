#!/usr/bin/env python3
import json
import os

def convert_roles():
    """Convert roles from full_role_data.json format to roles.json format"""
    
    # Read the full role data
    with open('C:\\Users\\bhartman\\git\\grimmy\\data\\full_role_data.json', 'r', encoding='utf-8') as f:
        full_data = json.load(f)
    
    converted_roles = {}
    
    for role_data in full_data:
        # Determine alignment based on team
        team = role_data.get('team', '')
        if team in ['Minion', 'Demon']:
            alignment = 1  # Evil
        else:
            alignment = 0  # Good (Townsfolk, Outsider, or other)
        
        # Determine setup value
        setup = role_data.get('modifiesSetup', 'No') == 'Yes'
        
        # Determine left value (firstNight)
        left = 1 if role_data.get('firstNight') else 0
        
        # Determine right value (otherNight)
        right = 1 if role_data.get('otherNight') else 0
        
        # Process reminder
        reminders_str = role_data.get('reminders', '')
        reminders_global_str = role_data.get('remindersGlobal', '')
        reminders = []
        if reminders_str:
            reminders += [r.strip() for r in reminders_str.split(',') if r.strip()]
        if reminders_global_str:
            reminders += [r.strip() for r in reminders_global_str.split(',') if r.strip()]
        
        # Set top to length of reminders list
        top = len(reminders)
        
        # Create the converted role entry
        converted_roles[role_data.get('id')] = {
            'name': role_data.get('name').lower(),
            'alignment': alignment,
            'category': role_data.get('team').lower(),
            'description': role_data.get('ability', ''),
            'top': top,
            'left': left,
            'right': right,
            'setup': setup,
            'reminders': reminders
        }
    
    # Write the converted data to roles.json
    with open('C:\\Users\\bhartman\\git\\grimmy\\data\\roles.json', 'w') as f:
        json.dump(converted_roles, f, indent=4)
    
    print(f"Converted {len(converted_roles)} roles from full_role_data.json to roles.json")
    
    # Print summary of conversion
    good_count = sum(1 for role in converted_roles.values() if role['alignment'] == 0)
    evil_count = sum(1 for role in converted_roles.values() if role['alignment'] == 1)
    setup_count = sum(1 for role in converted_roles.values() if role['setup'])
    
    print(f"Summary:")
    print(f"  Good roles: {good_count}")
    print(f"  Evil roles: {evil_count}")
    print(f"  Setup-modifying roles: {setup_count}")

if __name__ == '__main__':
    try:
        convert_roles()
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Make sure full_role_data.json exists in the current directory")
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")