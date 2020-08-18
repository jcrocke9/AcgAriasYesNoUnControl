import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class AcgAriasYesNoUnControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	// Value of the field is stored and used inside the component
	private envYesValue = "Yes";
	private value: number | null;
	private valueOfYes: number | null;
	private options: ComponentFramework.PropertyHelper.OptionMetadata[] | undefined;
	private selectedIndex: number;
	// reference to the notifyOutputChanged method
	private notifyOutputChanged: () => void;
	private selectElement: HTMLSelectElement;
	private container: HTMLDivElement;
	private context: ComponentFramework.Context<IInputs>;
	private _refreshIndex: any;
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this.context = context;
		this.container = document.createElement("div");
		this.container.setAttribute("class", "acgContainer")
		this._refreshIndex = this.refreshIndex.bind(this);
		this.notifyOutputChanged = notifyOutputChanged;
		this.value = context.parameters.acgAriasYesNoUnControl.raw;
		console.log("the init value: ", this.value);
		this.options = context.parameters.acgAriasYesNoUnControl.attributes?.Options;
		console.log(this.options);
		this.selectElement = document.createElement("select");
		var zeroEle = this.selectElement.appendChild(new Option("---", (-1).toString()));
		zeroEle.style.backgroundColor = "#ffffff";
		if (this.options) {
			if (this.options.length > 0) {
				this.options.map((option: ComponentFramework.PropertyHelper.OptionMetadata, index: number) => {
					var ele = this.selectElement.appendChild(new Option(option.Label, option.Value.toString()));
					ele.style.backgroundColor = "#ffffff";
					if (option.Label === this.envYesValue) {
						//console.log("green option: ", option.Value);
						this.valueOfYes = option.Value;
					}
					if (this.value === option.Value) {
						this.selectedIndex = index;
						//console.log("selectedIndex ", this.selectedIndex);
						this.selectElement.selectedIndex = index;
						ele.dataset.selected = "true";
					}
				})
			}
		}
		//console.log(this.selectElement.options);
		this.selectElement.value = this.value?.toString() || "-1";
		this.selectElement.addEventListener('change', this._refreshIndex);
		this.selectElement.setAttribute("class", "acgYesNoUnControl");
		this.container.appendChild(this.selectElement);
		container.appendChild(this.container);
		this.notifyOutputChanged();
	}

	public refreshIndex(): void {
		var index = this.selectElement.selectedIndex.valueOf();
		//console.log("refreshIndex says: ", index);
		this.selectedIndex = index;
		this.selectElement.selectedIndex = index;
		this.selectElement.options[this.selectedIndex].dataset.selected = "true";
		for (let index = 0; index < this.selectElement.options.length; index++) {
			const element = this.selectElement.options[index];
			if (index != this.selectedIndex) {
				if (element.getAttribute("data-selected")) {
					element.removeAttribute("data-selected");
				}
			}
		}
		this.value = (this.selectElement.value as any) as number;
		this.notifyOutputChanged();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this.context = context;
		// storing the latest context from the control.
		this.value = context.parameters.acgAriasYesNoUnControl.raw
			? context.parameters.acgAriasYesNoUnControl.raw
			: context.parameters.acgAriasYesNoUnControl.raw === 0
				? 0
				: -1;
		if (this.value === this.valueOfYes) {
			this.selectElement.style.backgroundColor = "#8cbd18";
		} else {
			this.selectElement.style.backgroundColor = "#ffffff";
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		if (this.value) {
			return {
				acgAriasYesNoUnControl: this.value
			}
		} else { return {} }
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		this.selectElement.removeEventListener("change", this._refreshIndex);
	}
}