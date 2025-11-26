import { Lightning } from "./Lightning";
import { Meteor } from "./Meteor";
import { Tornado } from "./Tornado";
import { Object } from "../../web_sockets/types_transfert";

export interface AvailableObjects {
	Lightning?: Lightning;
	Tornado?: Tornado;
	Meteor?: Meteor;
};

class ObjectManager {
	private readonly availableObjects: AvailableObjects[];
	private objects: Object[] = [];
	//private readonly sceneObservable: babylon.Observable<babylon.Scene>;
	//private readonly sceneObserver: babylon.Observer<babylon.Scene>;

	constructor(availableObjects: AvailableObjects[]) {
		this.availableObjects = availableObjects;
	}

	startSpawn(): void {
		this.availableObjects.forEach(object => {
			
		});
	}
}