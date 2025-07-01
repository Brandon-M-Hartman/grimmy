import { Application } from "../application";
import { Game } from "../game";
import { EDITIONS, setCustomScript } from "../editions";
import { Screen } from "../screen";

export class SettingsScreen extends Screen {
    constructor() {
        super();

        this.contents.onclick = () => {
            Application.ui.popScreen();
        };

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const title = document.createElement('div');
        title.className = "title";
        container.appendChild(title);

        const h = document.createElement('span');
        h.textContent = "Settings";
        title.appendChild(h);

        const settingsContainer = document.createElement('div');
        settingsContainer.className = "settings-container";
        container.appendChild(settingsContainer);

        // Edition selection
        const editionSection = document.createElement('div');
        editionSection.className = "setting-section";
        settingsContainer.appendChild(editionSection);

        const editionLabel = document.createElement('div');
        editionLabel.className = "setting-label";
        editionLabel.textContent = "Edition";
        editionSection.appendChild(editionLabel);

        const editionButtons = document.createElement('div');
        editionButtons.className = "edition-buttons";
        editionSection.appendChild(editionButtons);

        // Custom script input area (initially hidden)
        const customScriptSection = document.createElement('div');
        customScriptSection.className = "custom-script-section";
        customScriptSection.style.display = "none";
        customScriptSection.onclick = (e) => {
            e.stopPropagation();
        };
        editionSection.appendChild(customScriptSection);

        const customScriptLabel = document.createElement('div');
        customScriptLabel.className = "setting-label";
        customScriptLabel.textContent = "Paste Custom Script JSON:";
        customScriptSection.appendChild(customScriptLabel);

        const customScriptTextarea = document.createElement('textarea');
        customScriptTextarea.className = "custom-script-input";
        customScriptTextarea.placeholder = 'Paste your custom script JSON here...';
        customScriptTextarea.onclick = (e) => {
            e.stopPropagation();
        };
        customScriptSection.appendChild(customScriptTextarea);

        const customScriptButton = document.createElement('button');
        customScriptButton.className = "custom-script-load";
        customScriptButton.textContent = "Load Script";
        customScriptSection.appendChild(customScriptButton);

        const errorMessage = document.createElement('div');
        errorMessage.className = "error-message";
        errorMessage.style.display = "none";
        customScriptSection.appendChild(errorMessage);

        const successMessage = document.createElement('div');
        successMessage.className = "success-message";
        successMessage.style.display = "none";
        customScriptSection.appendChild(successMessage);

        customScriptButton.onclick = (e) => {
            e.stopPropagation();
            try {
                const jsonInput = customScriptTextarea.value.trim();
                if (!jsonInput) {
                    throw new Error('Please enter JSON data');
                }
                setCustomScript(jsonInput);
                errorMessage.style.display = "none";
                errorMessage.textContent = "";
                successMessage.style.display = "block";
                successMessage.textContent = `Custom script loaded successfully with ${EDITIONS.custom.roles.length} roles!`;
            } catch (error) {
                successMessage.style.display = "none";
                successMessage.textContent = "";
                errorMessage.style.display = "block";
                errorMessage.textContent = error instanceof Error ? error.message : 'Invalid script format';
            }
        };

        Object.values(EDITIONS).forEach(edition => {
            const button = document.createElement('button');
            button.className = "edition-button";
            button.textContent = edition.name;
            
            if (Game.currentEdition.id === edition.id) {
                button.classList.add('selected');
            }
            
            button.onclick = (e) => {
                e.stopPropagation();
                
                // Remove selected class from all buttons
                editionButtons.querySelectorAll('.edition-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Add selected class to clicked button
                button.classList.add('selected');
                
                // Show/hide custom script section
                if (edition.id === 'custom') {
                    customScriptSection.style.display = "block";
                } else {
                    customScriptSection.style.display = "none";
                }
                
                // Set the edition
                Game.setEdition(edition.id);
            };
            
            editionButtons.appendChild(button);
        });
    }
}