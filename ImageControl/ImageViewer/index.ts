import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ImageViewer implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private img: HTMLImageElement;
    private input: HTMLInputElement;
    private deleteBtn: HTMLButtonElement;
    private saveBtn: HTMLButtonElement;

    private notifyOutputChanged: () => void;
    private currentValue: string | null = null;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {

        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        // Image
        this.img = document.createElement("img");
        this.img.style.width = "150px";   // small size
        this.img.style.height = "150px";
        this.img.style.borderRadius = "10px";
        this.img.style.display = "none";

        // Input
        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.placeholder = "Enter Image URL";

        // Save Button
        this.saveBtn = document.createElement("button");
        this.saveBtn.innerText = "Save";
        this.saveBtn.onclick = () => {
            this.currentValue = this.input.value;
            this.notifyOutputChanged();
            this.updateUI();
        };

        // Delete Button
        this.deleteBtn = document.createElement("button");
        this.deleteBtn.innerText = "Delete";
        this.deleteBtn.style.display = "none";
        this.deleteBtn.onclick = () => {
            this.currentValue = null;
            this.notifyOutputChanged();
            this.updateUI();
        };

        this.container.appendChild(this.img);
        this.container.appendChild(this.input);
        this.container.appendChild(this.saveBtn);
        this.container.appendChild(this.deleteBtn);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.currentValue = context.parameters.imageUrl.raw;
        this.updateUI();
    }

    private updateUI(): void {
        if (this.currentValue) {
            this.img.src = this.currentValue;
            this.img.style.display = "block";

            this.input.style.display = "none";
            this.saveBtn.style.display = "none";

            this.deleteBtn.style.display = "inline-block";
        } else {
            this.img.style.display = "none";

            this.input.style.display = "block";
            this.saveBtn.style.display = "inline-block";

            this.deleteBtn.style.display = "none";
        }
    }

    public getOutputs(): IOutputs {
        return {
            imageUrl: this.currentValue || ""
        };
    }

    public destroy(): void {
        this.container.innerHTML = "";
    }
}