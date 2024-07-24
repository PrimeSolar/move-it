// The Library of Custom Reusable Web Elements
// This file is the library containing my collection of custom, reusable web elements
// that can be used across different parts of the project. These elements go beyond what browsers provide,
// allowing for expanded capabilities and functionality in the project.

// Access
gAccess = document.querySelector("#gAccess");

function gAccessF(gAccess) {
  if (gAccess != null && gAccess.innerHTML == "") {
    gAccess.innerHTML += `
<td class="text-center fw-bold"><a name="gAccess"></a>
Access
</td>
<td><p>
The level of accessibility a moving company will have when entering your home. This may include factors such as the infrastructure or design of your home, the distance from your home to the moving truck, accessibility to an elevator or stairs, etcetera.
</p></td>
      `
  }
}
gAccessF(gAccess);

// Actual Charges
gActualCharges = document.querySelector("#gActualCharges");

function gActualChargesF(gActualCharges) {
  if (gActualCharges != null && gActualCharges.innerHTML == "") {
    gActualCharges.innerHTML += `
<td class="text-center fw-bold"><a name="gActualCharges"></a>
Actual Charges
</td>
<td><p>
The complete amount charged for all services related to transporting your belongings from one location to another during a relocation.
</p></td>
      `
  }
}
gActualChargesF(gActualCharges);

// Additional Charges
gAdditionalCharges = document.querySelector("#gAdditionalCharges");

function gAdditionalChargesF(gAdditionalCharges) {
  if (gAdditionalCharges != null && gAdditionalCharges.innerHTML == "") {
    gAdditionalCharges.innerHTML += `
<td class="text-center fw-bold"><a name="gAdditionalCharges"></a>
Additional Charges
</td>
<td><p>
The expenses charged by a moving company for the various services they provide during a relocation, such as appliance servicing (for example, moving a refrigerator), unpacking assistance, and other related tasks.
</p></td>
      `
  }
}
gAdditionalChargesF(gAdditionalCharges);

// Agent
gAgent = document.querySelector("#gAgent");

function gAgentF(gAgent) {
  if (gAgent != null && gAgent.innerHTML == "") {
    gAgent.innerHTML += `
<td class="text-center fw-bold"><a name="gAgent"></a>
Agent
</td>
<td><p>
A skilled professional employed by a company to provide specialized services.
</p></td>
      `
  }
}
gAgentF(gAgent);

// Agreed Delivery Date
gAgreedDeliveryDate = document.querySelector("#gAgreedDeliveryDate");

function gAgreedDeliveryDateF(gAgreedDeliveryDate) {
  if (gAgreedDeliveryDate != null && gAgreedDeliveryDate.innerHTML == "") {
    gAgreedDeliveryDate.innerHTML += `
<td class="text-center fw-bold"><a name="gAgreedDeliveryDate"></a>
Agreed Delivery Date
</td>
<td><p>
The date agreed upon by a vendor and client for the delivery of a purchase or shipment.
</p></td>
      `
  }
}
gAgreedDeliveryDateF(gAgreedDeliveryDate);

// Appliance Service
gApplianceService = document.querySelector("#gApplianceService");

function gApplianceServiceF(gApplianceService) {
  if (gApplianceService != null && gApplianceService.innerHTML == "") {
    gApplianceService.innerHTML += `
<td class="text-center fw-bold"><a name="gApplianceService"></a>
Appliance Service
</td>
<td><p>
The process of preparing an appliance, such as a refrigerator, washer, or dryer, prior to a move. This typically involves unplugging the appliance, draining any fluids, and securing any moving parts to ensure the appliance is safe and secure for transportation during the relocation.
</p></td>
      `
  }
}
gApplianceServiceF(gApplianceService);

// Appliance Dolly
gApplianceDolly = document.querySelector("#gApplianceDolly");

function gApplianceDollyF(gApplianceDolly) {
  if (gApplianceDolly != null && gApplianceDolly.innerHTML == "") {
    gApplianceDolly.innerHTML += `
<td class="text-center fw-bold"><a name="gApplianceDolly"></a>
Appliance Dolly
</td>
<td><p>
The wheeled platform used to move appliances or heavy household items.
</p></td>
      `
  }
}
gApplianceDollyF(gApplianceDolly);

// Assessed Value
gAssessedValue = document.querySelector("#gAssessedValue");

function gAssessedValueF(gAssessedValue) {
  if (gAssessedValue != null && gAssessedValue.innerHTML == "") {
    gAssessedValue.innerHTML += `
<td class="text-center fw-bold"><a name="gAssessedValue"></a>
Assessed Value
</td>
<td class="cell-left"
<p>The amount of funds you will need to pay based on the assessed value of your goods. This is typically measured for every 1000 units of currency.
</p></td>
      `
  }
}
gAssessedValueF(gAssessedValue);

// Bill of Lading
gBillOfLading = document.querySelector("#gBillOfLading");

function gBillOfLadingF(gBillOfLading) {
  if (gBillOfLading != null && gBillOfLading.innerHTML == "") {
    gBillOfLading.innerHTML += `
<td class="text-center fw-bold"><a name="gBillOfLading"></a>
Bill of Lading
</td>
<td><p>
A legal document that serves as a contract between the moving company and the client. It lists all the items being transported, the agreed-upon terms of the move, and provides authorization for the moving company to handle and deliver the client's belongings. The bill of lading is signed by both the client and the moving company representative, and a copy is provided to the client.
</p></td>
      `
  }
}
gBillOfLadingF(gBillOfLading);

// Binding
gBinding = document.querySelector("#gBinding");

function gBindingF(gBinding) {
  if (gBinding != null && gBinding.innerHTML == "") {
    gBinding.innerHTML += `
<td class="text-center fw-bold"><a name="gBinding"></a>
Binding
</td>
<td><p>
A flat price given by a moving company regardless of the time that is taken.
</p></td>
      `
  }
}
gBindingF(gBinding);

// Bulky Article Charge
gBulkyArticleCharge = document.querySelector("#gBulkyArticleCharge");

function gBulkyArticleChargeF(gBulkyArticleCharge) {
  if (gBulkyArticleCharge != null && gBulkyArticleCharge.innerHTML == "") {
    gBulkyArticleCharge.innerHTML += `
<td class="text-center fw-bold"><a name="gBulkyArticleCharge"></a>
Bulky Article Charge
</td>
<td><p>
Especially large or cumbersome items belonging to the client can be subject to supplementary fees charged by the moving company. This is due to the specialized packing materials and handling techniques required to safely transport these types of belongings.
</p></td>
      `
  }
}
gBulkyArticleChargeF(gBulkyArticleCharge);

// Cargo
gCargo = document.querySelector("#gCargo");

function gCargoF(gCargo) {
  if (gCargo != null && gCargo.innerHTML == "") {
    gCargo.innerHTML += `
<td class="text-center fw-bold"><a name="gCargo"></a>
Cargo
</td>
<td><p>
A shipment being transported by air, boat of vehicle.
</p></td>
      `
  }
}
gCargoF(gCargo);

// Carrier
gCarrier = document.querySelector("#gCarrier");

function gCarrierF(gCarrier) {
  if (gCarrier != null && gCarrier.innerHTML == "") {
    gCarrier.innerHTML += `
<td class="text-center fw-bold"><a name="gCarrier"></a>
Carrier
</td>
<td><p>
The moving company that a client has contracted with to facilitate their relocation and handle the transportation of their belongings.
</p></td>
      `
  }
}
gCarrierF(gCarrier);

// Cartage
gCartage = document.querySelector("#gCartage");

function gCartageF(gCartage) {
  if (gCartage != null && gCartage.innerHTML == "") {
    gCartage.innerHTML += `
<td class="text-center fw-bold"><a name="gCartage"></a>
Cartage
</td>
<td><p>
The process of relocating a client's belongings from a storage facility to their final destination as part of the overall moving service.
</p></td>
      `
  }
}
gCartageF(gCartage);

// Carton
gCarton = document.querySelector("#gCarton");

function gCartonF(gCarton) {
  if (gCarton != null && gCarton.innerHTML == "") {
    gCarton.innerHTML += `
<td class="text-center fw-bold"><a name="gCarton"></a>
Carton
</td>
<td><p>
Another term used for a moving box.
</p></td>
      `
  }
}
gCartonF(gCarton);

// Cash on Delivery (C.O.D)
gCashonDeliveryCOD = document.querySelector("#gCashonDeliveryCOD");

function gCashonDeliveryCODF(gCashonDeliveryCOD) {
  if (gCashonDeliveryCOD != null && gCashonDeliveryCOD.innerHTML == "") {
    gCashonDeliveryCOD.innerHTML += `
<td class="text-center fw-bold"><a name="gCashonDeliveryCOD"></a>
Cash on Delivery (C.O.D)
</td>
<td><p>
A payment arrangement where the client agrees to pay the moving company for the shipment once the goods have been delivered to the final destination.
</p></td>
      `
  }
}
gCashonDeliveryCODF(gCashonDeliveryCOD);

// Change Order
gChangeOrder = document.querySelector("#gChangeOrder");

function gChangeOrderF(gChangeOrder) {
  if (gChangeOrder != null && gChangeOrder.innerHTML == "") {
    gChangeOrder.innerHTML += `
<td class="text-center fw-bold"><a name="gChangeOrder"></a>
Change Order
</td>
<td><p>
A document or form used to change the original estimate on your statement due to an addition or removal of services requested.
</p></td>
      `
  }
}
gChangeOrderF(gChangeOrder);

// Crating
gCrating = document.querySelector("#gCrating");

function gCratingF(gCrating) {
  if (gCrating != null && gCrating.innerHTML == "") {
    gCrating.innerHTML += `
<td class="text-center fw-bold"><a name="gCrating"></a>
Crating
</td>
<td><p>
The process of packing delicate, fragile, or valuable items in a sturdy wooden crate, rather than a standard moving box. Crating provides enhanced protection and security for high-value possessions during the moving process.
</p></td>
      `
  }
}
gCratingF(gCrating);

// Cross-Regional Move
gCrossRegionalMove = document.querySelector("#gCrossRegionalMove");

function gCrossRegionalMoveF(gCrossRegionalMove) {
  if (gCrossRegionalMove != null && gCrossRegionalMove.innerHTML == "") {
    gCrossRegionalMove.innerHTML += `
<td class="text-center fw-bold"><a name="gCrossRegionalMove"></a>
Cross-Regional Move
</td>
<td><p>
A shipment moving between two or more regions.
</p></td>
      `
  }
}
gCrossRegionalMoveF(gCrossRegionalMove);

// Cube
gCube = document.querySelector("#gCube");

function gCubeF(gCube) {
  if (gCube != null && gCube.innerHTML == "") {
    gCube.innerHTML += `
<td class="text-center fw-bold"><a name="gCube"></a>
Cube
</td>
<td><p>
A measurement of volume used to quantify the space available in a moving truck, van, or container.
</p></td>
      `
  }
}
gCubeF(gCube);

// Cube Sheet
gCubeSheet = document.querySelector("#gCubeSheet");

function gCubeSheetF(gCubeSheet) {
  if (gCubeSheet != null && gCubeSheet.innerHTML == "") {
    gCubeSheet.innerHTML += `
<td class="text-center fw-bold"><a name="gCubeSheet"></a>
Cube Sheet
</td>
<td><p>
A sheet containing measurements of household items to move.
</p></td>
      `
  }
}
gCubeSheetF(gCubeSheet);

// Delivery Report
gDeliveryReport = document.querySelector("#gDeliveryReport");

function gDeliveryReportF(gDeliveryReport) {
  if (gDeliveryReport != null && gDeliveryReport.innerHTML == "") {
    gDeliveryReport.innerHTML += `
<td class="text-center fw-bold"><a name="gDeliveryReport"></a>
Delivery Report
</td>
<td><p>
A report the client signs to verify their delivery at their final destination.
</p></td>
      `
  }
}
gDeliveryReportF(gDeliveryReport);

// Delivery Window
gDeliveryWindow = document.querySelector("#gDeliveryWindow");

function gDeliveryWindowF(gDeliveryWindow) {
  if (gDeliveryWindow != null && gDeliveryWindow.innerHTML == "") {
    gDeliveryWindow.innerHTML += `
<td class="text-center fw-bold"><a name="gDeliveryWindow"></a>
Delivery Window
</td>
<td><p>
The window of time the movers are supposed to deliver a shipment. This can range from hours to days depending on your final location and miles traveled between destinations.
</p></td>
      `
  }
}
gDeliveryWindowF(gDeliveryWindow);

// Destination Agent
gDestinationAgent = document.querySelector("#gDestinationAgent");

function gDestinationAgentF(gDestinationAgent) {
  if (gDestinationAgent != null && gDestinationAgent.innerHTML == "") {
    gDestinationAgent.innerHTML += `
<td class="text-center fw-bold"><a name="gDestinationAgent"></a>
Destination Agent
</td>
<td><p>
The agent who is designated to assist in any shipment requests or provide information and answer questions regarding a clients shipment.
</p></td>
      `
  }
}
gDestinationAgentF(gDestinationAgent);

// Diversion
gDiversion = document.querySelector("#gDiversion");

function gDiversionF(gDiversion) {
  if (gDiversion != null && gDiversion.innerHTML == "") {
    gDiversion.innerHTML += `
<td class="text-center fw-bold"><a name="gDiversion"></a>
Diversion
</td>
<td><p>
A situation where a client needs to change the destination of their shipment after it has already been dispatched.
</p></td>
      `
  }
}
gDiversionF(gDiversion);

// Divider
gDivider = document.querySelector("#gDivider");

function gDividerF(gDivider) {
  if (gDivider != null && gDivider.innerHTML == "") {
    gDivider.innerHTML += `
<td class="text-center fw-bold"><a name="gDivider"></a>
Divider
</td>
<td><p>
A specialized equipment installed within the moving truck or van to separate and organize the transportation of a client's various belongings.
</p></td>
      `
  }
}
gDividerF(gDivider);

// Dispatcher
gDispatcher = document.querySelector("#gDispatcher");

function gDispatcherF(gDispatcher) {
  if (gDispatcher != null && gDispatcher.innerHTML == "") {
    gDispatcher.innerHTML += `
<td class="text-center fw-bold"><a name="gDispatcher"></a>
Dispatcher
</td>
<td><p>
A person who communicates the route of a shipment to operators and agents.
</p></td>
      `
  }
}
gDispatcherF(gDispatcher);

// Door to Door Service
gDoorToDoorService = document.querySelector("#gDoorToDoorService");

function gDoorToDoorServiceF(gDoorToDoorService) {
  if (gDoorToDoorService != null && gDoorToDoorService.innerHTML == "") {
    gDoorToDoorService.innerHTML += `
<td class="text-center fw-bold"><a name="gDoorToDoorService"></a>
Door to Door Service
</td>
<td><p>
The act of shipping from an original destination to a final destination directly.
</p></td>
      `
  }
}
gDoorToDoorServiceF(gDoorToDoorService);

// Elevator Charge
gElevatorCharge = document.querySelector("#gElevatorCharge");

function gElevatorChargeF(gElevatorCharge) {
  if (gElevatorCharge != null && gElevatorCharge.innerHTML == "") {
    gElevatorCharge.innerHTML += `
<td class="text-center fw-bold"><a name="gElevatorCharge"></a>
Elevator Charge
</td>
<td><p>
An additional charge during a move if items need to be transported via elevator.
</p></td>
      `
  }
}
gElevatorChargeF(gElevatorCharge);

// En Route
gEnRoute = document.querySelector("#gEnRoute");

function gEnRouteF(gEnRoute) {
  if (gEnRoute != null && gEnRoute.innerHTML == "") {
    gEnRoute.innerHTML += `
<td class="text-center fw-bold"><a name="gEnRoute"></a>
En Route
</td>
<td><p>
On the way.
</p></td>
      `
  }
}
gEnRouteF(gEnRoute);

// Essentials Box
gEssentialsBox = document.querySelector("#gEssentialsBox");

function gEssentialsBoxF(gEssentialsBox) {
  if (gEssentialsBox != null && gEssentialsBox.innerHTML == "") {
    gEssentialsBox.innerHTML += `
<td class="text-center fw-bold"><a name="gEssentialsBox"></a>
Essentials Box
</td>
<td><p>
A box of essential items such as medication that should travel solely with the shipper so they have access to them at all times.
</p></td>
      `
  }
}
gEssentialsBoxF(gEssentialsBox);

// Extended Liability
gExtendedLiability = document.querySelector("#gExtendedLiability");

function gExtendedLiabilityF(gExtendedLiability) {
  if (gExtendedLiability != null && gExtendedLiability.innerHTML == "") {
    gExtendedLiability.innerHTML += `
<td class="text-center fw-bold"><a name="gExtendedLiability"></a>
Extended Liability
</td>
<td><p>
An additional monetary amount assigned to cover the declared value of a client's belongings while they are being transported or held in storage by the moving company.
</p></td>
      `
  }
}
gExtendedLiabilityF(gExtendedLiability);

// Flight Charge
gFlightCharge = document.querySelector("#gFlightCharge");

function gFlightChargeF(gFlightCharge) {
  if (gFlightCharge != null && gFlightCharge.innerHTML == "") {
    gFlightCharge.innerHTML += `
<td class="text-center fw-bold"><a name="gFlightCharge"></a>
Flight Charge
</td>
<td><p>
Also known as a stair fee. This is an additional charge for moving things up and down staircases.
</p></td>
      `
  }
}
gFlightChargeF(gFlightCharge);

// Full Service Move
gFullServiceMove = document.querySelector("#gFullServiceMove");

function gFullServiceMoveF(gFullServiceMove) {
  if (gFullServiceMove != null && gFullServiceMove.innerHTML == "") {
    gFullServiceMove.innerHTML += `
<td class="text-center fw-bold"><a name="gFullServiceMove"></a>
Full Service Move
</td>
<td><p>
The complete process of relocating from one residence or office to another, including all steps from start to finish such as packing belongings, loading them onto a moving truck, transporting them to the new location, unloading the truck, and unpacking items in the new space.
</p></td>
      `
  }
}
gFullServiceMoveF(gFullServiceMove);

// Furniture Blankets
gFurnitureBlankets = document.querySelector("#gFurnitureBlankets");

function gFurnitureBlanketsF(gFurnitureBlankets) {
  if (gFurnitureBlankets != null && gFurnitureBlankets.innerHTML == "") {
    gFurnitureBlankets.innerHTML += `
<td class="text-center fw-bold"><a name="gFurnitureBlankets"></a>
Furniture Blankets
</td>
<td><p>
Soft covers designed to protect furniture from damage during a move.
</p></td>
      `
  }
}
gFurnitureBlanketsF(gFurnitureBlankets);

// Furniture Pads
gFurniturePads = document.querySelector("#gFurniturePads");

function gFurniturePadsF(gFurniturePads) {
  if (gFurniturePads != null && gFurniturePads.innerHTML == "") {
    gFurniturePads.innerHTML += `
<td class="text-center fw-bold"><a name="gFurniturePads"></a>
Furniture Pads
</td>
<td><p>
Pads used on the bottom of furniture to avoid scratching and scuffing floors.
</p></td>
      `
  }
}
gFurniturePadsF(gFurniturePads);

// Gross Weight
gGrossWeight = document.querySelector("#gGrossWeight");

function gGrossWeightF(gGrossWeight) {
  if (gGrossWeight != null && gGrossWeight.innerHTML == "") {
    gGrossWeight.innerHTML += `
<td class="text-center fw-bold"><a name="gGrossWeight"></a>
Gross Weight
</td>
<td><p>
The total weight of the moving vehicle, including the weight of the shipment being transported. This represents the combined weight of the empty moving truck or van plus all the items being moved.
</p></td>
      `
  }
}
gGrossWeightF(gGrossWeight);

// High Value Article
gHighValueArticle = document.querySelector("#gHighValueArticle");

function gHighValueArticleF(gHighValueArticle) {
  if (gHighValueArticle != null && gHighValueArticle.innerHTML == "") {
    gHighValueArticle.innerHTML += `
<td class="text-center fw-bold"><a name="gHighValueArticle"></a>
High Value Article
</td>
<td><p>
Items of extraordinary value.
</p></td>
      `
  }
}
gHighValueArticleF(gHighValueArticle);

// In-Transit
gInTransit = document.querySelector("#gInTransit");

function gInTransitF(gInTransit) {
  if (gInTransit != null && gInTransit.innerHTML == "") {
    gInTransit.innerHTML += `
<td class="text-center fw-bold"><a name="gInTransit"></a>
In-Transit
</td>
<td><p>
The status of a shipment when it is actively being transported between the origin location and the final destination.
</p></td>
      `
  }
}
gInTransitF(gInTransit);

// Inventory
gInventory = document.querySelector("#gInventory");

function gInventoryF(gInventory) {
  if (gInventory != null && gInventory.innerHTML == "") {
    gInventory.innerHTML += `
<td class="text-center fw-bold"><a name="gInventory"></a>
Inventory
</td>
<td><p>
A complete list of items in the shipment that will likely include quantity and condition.
</p></td>
      `
  }
}
gInventoryF(gInventory);

// Invoice
gInvoice = document.querySelector("#gInvoice");

function gInvoiceF(gInvoice) {
  if (gInvoice != null && gInvoice.innerHTML == "") {
    gInvoice.innerHTML += `
<td class="text-center fw-bold"><a name="gInvoice"></a>
Invoice
</td>
<td><p>
A bill presented to a client for an act of service.
</p></td>
      `
  }
}
gInvoiceF(gInvoice);

// Joint Rate
gJointRate = document.querySelector("#gJointRate");

function gJointRateF(gJointRate) {
  if (gJointRate != null && gJointRate.innerHTML == "") {
    gJointRate.innerHTML += `
<td class="text-center fw-bold"><a name="gJointRate"></a>
Joint Rate
</td>
<td><p>
A single rate calculated by two different carriers.
</p></td>
      `
  }
}
gJointRateF(gJointRate);

// Line Haul
gLineHaul = document.querySelector("#gLineHaul");

function gLineHaulF(gLineHaul) {
  if (gLineHaul != null && gLineHaul.innerHTML == "") {
    gLineHaul.innerHTML += `
<td class="text-center fw-bold"><a name="gLineHaul"></a>
Line Haul
</td>
<td><p>
The transportation-related revenue received by a moving company for the actual movement and delivery of a shipment from the origin to the final destination. This includes the costs associated with loading, transporting, and unloading the client's belongings.
</p></td>
      `
  }
}
gLineHaulF(gLineHaul);

// Line Haul Charges
gLineHaulCharges = document.querySelector("#gLineHaulCharges");

function gLineHaulChargesF(gLineHaulCharges) {
  if (gLineHaulCharges != null && gLineHaulCharges.innerHTML == "") {
    gLineHaulCharges.innerHTML += `
<td class="text-center fw-bold"><a name="gLineHaulCharges"></a>
Line Haul Charges
</td>
<td><p>
Tariffs and fees imposed by a long distance move.
</p></td>
      `
  }
}
gLineHaulChargesF(gLineHaulCharges);

// Load Date
gLoadDate = document.querySelector("#gLoadDate");

function gLoadDateF(gLoadDate) {
  if (gLoadDate != null && gLoadDate.innerHTML == "") {
    gLoadDate.innerHTML += `
<td class="text-center fw-bold"><a name="gLoadDate"></a>
Load Date
</td>
<td><p>
The specific date on which a moving company representative collects a client's belongings from their origin location to begin the transportation process.
</p></td>
      `
  }
}
gLoadDateF(gLoadDate);

// Local Move
gLocalMove = document.querySelector("#gLocalMove");

function gLocalMoveF(gLocalMove) {
  if (gLocalMove != null && gLocalMove.innerHTML == "") {
    gLocalMove.innerHTML += `
<td class="text-center fw-bold"><a name="gLocalMove"></a>
Local Move
</td>
<td><p>
A move that takes place within a limited geographical area, such as within the same city, county, or zip code.
</p></td>
      `
  }
}
gLocalMoveF(gLocalMove);

// Long Carry Fee
gLongCarryFee = document.querySelector("#gLongCarryFee");

function gLongCarryFeeF(gLongCarryFee) {
  if (gLongCarryFee != null && gLongCarryFee.innerHTML == "") {
    gLongCarryFee.innerHTML += `
<td class="text-center fw-bold"><a name="gLongCarryFee"></a>
Long Carry Fee
</td>
<td><p>
An additional charge that occurs when the distance from the end of the moving van and the delivery destination exceeds 25 meters.
</p></td>
      `
  }
}
gLongCarryFeeF(gLongCarryFee);

// Long Term Storage
gLongTermStorage = document.querySelector("#gLongTermStorage");

function gLongTermStorageF(gLongTermStorage) {
  if (gLongTermStorage != null && gLongTermStorage.innerHTML == "") {
    gLongTermStorage.innerHTML += `
<td class="text-center fw-bold"><a name="gLongTermStorage"></a>
Long Term Storage
</td>
<td><p>
The extended storage of a client's belongings by a moving company for a period longer than the initial 30-day timeframe.
</p></td>
      `
  }
}
gLongTermStorageF(gLongTermStorage);

// Moving Company
gMovingCompany = document.querySelector("#gMovingCompany");

function gMovingCompanyF(gMovingCompany) {
  if (gMovingCompany != null && gMovingCompany.innerHTML == "") {
    gMovingCompany.innerHTML += `
<td class="text-center fw-bold"><a name="gMovingCompany"></a>
Moving Company
</td>
<td><p>
A company that facilitates the transportation of a client's belongings from their original location (point A) to their new destination (point B), offering comprehensive assistance throughout the moving process.
</p></td>
      `
  }
}
gMovingCompanyF(gMovingCompany);

// Moving Cost
gMovingCost = document.querySelector("#gMovingCost");

function gMovingCostF(gMovingCost) {
  if (gMovingCost != null && gMovingCost.innerHTML == "") {
    gMovingCost.innerHTML += `
<td class="text-center fw-bold"><a name="gMovingCost"></a>
Moving Cost
</td>
<td><p>
The cost charged by the moving company solely for the transportation of the client's household goods, excluding any additional fees such as the cost of insurance coverage.
</p></td>
      `
  }
}
gMovingCostF(gMovingCost);

// Net Weight
gNetWeight = document.querySelector("#gNetWeight");

function gNetWeightF(gNetWeight) {
  if (gNetWeight != null && gNetWeight.innerHTML == "") {
    gNetWeight.innerHTML += `
<td class="text-center fw-bold"><a name="gNetWeight"></a>
Net Weight
</td>
<td><p>
The actual weight of shipment subtracting the ‘tare weight’ or weight of the truck.
</p></td>
      `
  }
}
gNetWeightF(gNetWeight);

// Non-Binding Estimate
gNonBindingEstimate = document.querySelector("#gNonBindingEstimate");

function gNonBindingEstimateF(gNonBindingEstimate) {
  if (gNonBindingEstimate != null && gNonBindingEstimate.innerHTML == "") {
    gNonBindingEstimate.innerHTML += `
<td class="text-center fw-bold"><a name="gNonBindingEstimate"></a>
Non-Binding Estimate
</td>
<td><p>
The carriers estimated cost based on the estimated weight of a shipment.
</p></td>
      `
  }
}
gNonBindingEstimateF(gNonBindingEstimate);

// Origin Agent
gOriginAgent = document.querySelector("#gOriginAgent");

function gOriginAgentF(gOriginAgent) {
  if (gOriginAgent != null && gOriginAgent.innerHTML == "") {
    gOriginAgent.innerHTML += `
<td class="text-center fw-bold"><a name="gOriginAgent"></a>
Origin Agent
</td>
<td><p>
The agent that is dedicated in our origin area to help with a clients shipment service.
</p></td>
      `
  }
}
gOriginAgentF(gOriginAgent);

// Pallet
gPallet = document.querySelector("#gPallet");

function gPalletF(gPallet) {
  if (gPallet != null && gPallet.innerHTML == "") {
    gPallet.innerHTML += `
<td class="text-center fw-bold"><a name="gPallet"></a>
Pallet
</td>
<td><p>
A portable platform used for storage and transportation.
</p></td>
      `
  }
}
gPalletF(gPallet);

// Peak Season/Peak Season-Rate
gPeakSeasonPeakSeasonRate = document.querySelector("#gPeakSeasonPeakSeasonRate");

function gPeakSeasonPeakSeasonRateF(gPeakSeasonPeakSeasonRate) {
  if (gPeakSeasonPeakSeasonRate != null && gPeakSeasonPeakSeasonRate.innerHTML == "") {
    gPeakSeasonPeakSeasonRate.innerHTML += `
<td class="text-center fw-bold"><a name="gPeakSeasonPeakSeasonRate"></a>
Peak&nbsp;Season/Peak&nbsp;Season-Rate
</td>
<td><p>
A higher rate or fee charged by a moving company during certain times of the year, such as the summer months, when moving demand and volume is typically higher. These peak season rates account for factors like increased labor costs, equipment usage, and logistical challenges due to the high volume of moves occurring.
</p></td>
      `
  }
}
gPeakSeasonPeakSeasonRateF(gPeakSeasonPeakSeasonRate);

// Permanent Storage
gPermanentStorage = document.querySelector("#gPermanentStorage");

function gPermanentStorageF(gPermanentStorage) {
  if (gPermanentStorage != null && gPermanentStorage.innerHTML == "") {
    gPermanentStorage.innerHTML += `
<td class="text-center fw-bold"><a name="gPermanentStorage"></a>
Permanent Storage
</td>
<td><p>
The storage of goods indefinitely in a warehouse.
</p></td>
      `
  }
}
gPermanentStorageF(gPermanentStorage);

// Preferred Arrival Date (P.A.D)
gPreferredArrivalDatePAD = document.querySelector("#gPreferredArrivalDatePAD");

function gPreferredArrivalDatePADF(gPreferredArrivalDatePAD) {
  if (gPreferredArrivalDatePAD != null && gPreferredArrivalDatePAD.innerHTML == "") {
    gPreferredArrivalDatePAD.innerHTML += `
<td class="text-center fw-bold"><a name="gPreferredArrivalDatePAD"></a>
Preferred Arrival Date (P.A.D)
</td>
<td><p>
The date a client requests to have goods arrive to their final destination by.
</p></td>
      `
  }
}
gPreferredArrivalDatePADF(gPreferredArrivalDatePAD);

// Quote
gQuote = document.querySelector("#gQuote");

function gQuoteF(gQuote) {
  if (gQuote != null && gQuote.innerHTML == "") {
    gQuote.innerHTML += `
<td class="text-center fw-bold"><a name="gQuote"></a>
Quote
</td>
<td><p>
An estimate for the cost of a move.
</p></td>
      `
  }
}
gQuoteF(gQuote);

// Relocation Assistance
gRelocationAssistance = document.querySelector("#gRelocationAssistance");

function gRelocationAssistanceF(gRelocationAssistance) {
  if (gRelocationAssistance != null && gRelocationAssistance.innerHTML == "") {
    gRelocationAssistance.innerHTML += `
<td class="text-center fw-bold"><a name="gRelocationAssistance"></a>
Relocation Assistance
</td>
<td><p>
A service provided by an employer for relocating due to a job.
</p></td>
      `
  }
}
gRelocationAssistanceF(gRelocationAssistance);

// Routing
gRouting = document.querySelector("#gRouting");

function gRoutingF(gRouting) {
  if (gRouting != null && gRouting.innerHTML == "") {
    gRouting.innerHTML += `
<td class="text-center fw-bold"><a name="gRouting"></a>
Routing
</td>
<td><p>
The specific transportation route or method selected by the client when there are multiple options available for moving their belongings from one location to another.
</p></td>
      `
  }
}
gRoutingF(gRouting);

// Short Haul
gShortHaul = document.querySelector("#gShortHaul");

function gShortHaulF(gShortHaul) {
  if (gShortHaul != null && gShortHaul.innerHTML == "") {
    gShortHaul.innerHTML += `
<td class="text-center fw-bold"><a name="gShortHaul"></a>
Short Haul
</td>
<td><p>
A shipment that is less than 500 kilometers.
</p></td>
      `
  }
}
gShortHaulF(gShortHaul);

// Shuttle Service
gShuttleService = document.querySelector("#gShuttleService");

function gShuttleServiceF(gShuttleService) {
  if (gShuttleService != null && gShuttleService.innerHTML == "") {
    gShuttleService.innerHTML += `
<td class="text-center fw-bold"><a name="gShuttleService"></a>
Shuttle Service
</td>
<td><p>
The service of a smaller vehicle to access areas that a large truck could not.
</p></td>
      `
  }
}
gShuttleServiceF(gShuttleService);

// Storage In Transit (S.I.T)
gStorageInTransitSIT = document.querySelector("#gStorageInTransitSIT");

function gStorageInTransitSITF(gStorageInTransitSIT) {
  if (gStorageInTransitSIT != null && gStorageInTransitSIT.innerHTML == "") {
    gStorageInTransitSIT.innerHTML += `
<td class="text-center fw-bold"><a name="gStorageInTransitSIT"></a>
Storage In Transit (S.I.T)
</td>
<td><p>
Temporary storage of goods in the warehouse of the carriers agent pending further transportation.
</p></td>
      `
  }
}
gStorageInTransitSITF(gStorageInTransitSIT);

// Stretch Wrap
gStretchWrap = document.querySelector("#gStretchWrap");

function gStretchWrapF(gStretchWrap) {
  if (gStretchWrap != null && gStretchWrap.innerHTML == "") {
    gStretchWrap.innerHTML += `
<td class="text-center fw-bold"><a name="gStretchWrap"></a>
Stretch Wrap
</td>
<td><p>
The protective wrapping or padding materials utilized by the moving company's personnel to securely cover and safeguard the client's furniture during transportation.
</p></td>
      `
  }
}
gStretchWrapF(gStretchWrap);

// Survey
gSurvey = document.querySelector("#gSurvey");

function gSurveyF(gSurvey) {
  if (gSurvey != null && gSurvey.innerHTML == "") {
    gSurvey.innerHTML += `
<td class="text-center fw-bold"><a name="gSurvey"></a>
Survey
</td>
<td><p>
The process undertaken by a moving company representative, or agent, to assess a client's possessions and provide an estimated cost for the relocation services based on the volume, weight, and other factors of the client's belongings.
</p></td>
      `
  }
}
gSurveyF(gSurvey);

// Tag
gTag = document.querySelector("#gTag");

function gTagF(gTag) {
  if (gTag != null && gTag.innerHTML == "") {
    gTag.innerHTML += `
<td class="text-center fw-bold"><a name="gTag"></a>
Tag
</td>
<td><p>
A unique identification label, typically consisting of a number and/or color coding, that is affixed to each individual box, container, or item being transported during a move to facilitate organization and tracking of the client's belongings.
</p></td>
      `
  }
}
gTagF(gTag);

// Tare Weight
gTareWeight = document.querySelector("#gTareWeight");

function gTareWeightF(gTareWeight) {
  if (gTareWeight != null && gTareWeight.innerHTML == "") {
    gTareWeight.innerHTML += `
<td class="text-center fw-bold"><a name="gTareWeight"></a>
Tare Weight
</td>
<td><p>
The baseline weight of the moving truck or vehicle before any client belongings or shipments are loaded. This 'empty' weight is used as a reference point to calculate the total weight of the move once the client's items have been loaded onto the vehicle.
</p></td>
      `
  }
}
gTareWeightF(gTareWeight);

// Unpacking
gUnpacking = document.querySelector("#gUnpacking");

function gUnpackingF(gUnpacking) {
  if (gUnpacking != null && gUnpacking.innerHTML == "") {
    gUnpacking.innerHTML += `
<td class="text-center fw-bold"><a name="gUnpacking"></a>
Unpacking
</td>
<td><p>
The process of unpacking or removing a client's belongings from their original storage containers or packaging as part of the moving company's service offerings.
</p></td>
      `
  }
}
gUnpackingF(gUnpacking);

// Van Foreman
gVanForeman = document.querySelector("#gVanForeman");

function gVanForemanF(gVanForeman) {
  if (gVanForeman != null && gVanForeman.innerHTML == "") {
    gVanForeman.innerHTML += `
<td class="text-center fw-bold"><a name="gVanForeman"></a>
Van Foreman
</td>
<td><p>
The moving company employee who is tasked with overseeing the loading, secure transport, and unloading of the client's belongings during the relocation process.
</p></td>
      `
  }
}
gVanForemanF(gVanForeman);

// Van Line
gVanLine = document.querySelector("#gVanLine");

function gVanLineF(gVanLine) {
  if (gVanLine != null && gVanLine.innerHTML == "") {
    gVanLine.innerHTML += `
<td class="text-center fw-bold"><a name="gVanLine"></a>
Van Line
</td>
<td><p>
A network of agents employed by a moving company to coordinate and facilitate the logistics of a client's relocation.
</p></td>
      `
  }
}
gVanLineF(gVanLine);
