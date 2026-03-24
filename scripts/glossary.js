/**
 * Reusable Glossary Factory Function
 *
 * Creates a glossary term initializer with built-in validation and flexibility.
 * - @param {string} elementId - the identifier of the element to populate.
 * - @param {string} term - the glossary term.
 * - @param {string} description - the glossary term description.
 * - @param {Object} options - optional configuration.
 *
 * Copyright © Vladislav Kazantsev
 * All rights reserved.
 * This code is the intellectual property of Vladislav Kazantsev.
 * You are welcome to clone the related repository and use the code for exploratory purposes.
 * However, unauthorized reproduction, modification, or redistribution of this code (including cloning of related repository or altering it for activities beyond exploratory use) is strictly prohibited.
 * Code snippets may be shared only when the original author is explicitly credited and a direct link to the original source of the code is provided alongside the code snippet.
 * Sharing the link to the file is permitted, except when directed toward retrieval purposes.
 * Any form of interaction with this file is strictly prohibited when facilitated by the code, except when such interaction is for discussion or exchange purposes with others.
 * This copyright notice applies globally.
 * For inquiries about collaboration, usage outside exploratory purposes, or permissions, please contact: hypervisor7@pm.me
 */

function initializeGlossaryTerm(elementId, term, description, options = {}) {
  const { className = "text-center fw-bold", ariaLabel = term } = options;

  const element = document.querySelector(`#${elementId}`);

  element && element.innerHTML.trim() === ""
    ? (element.innerHTML = `
    <td class="${className}" aria-label="${ariaLabel}"><a name="${elementId}"></a>${term}</td>
    <td><p>${description}</p></td>
    `)
    : element && element.innerHTML.trim() !== ""
    ? console.warn(
        `The glossary element with the identifier "${elementId}" has a predefined content.`
      )
    : console.warn(
        `The glossary element with the identifier "${elementId}" is not found.`
      );
}

/** Access. */

initializeGlossaryTerm(
  "gAccess",
  "Access",
  "The level of accessibility a moving company will have when entering your home. This may include factors such as the infrastructure or design of your home, the distance from your home to the moving truck, accessibility to an elevator or stairs, etcetera."
);

/** Actual Charges. */

initializeGlossaryTerm(
  "gActualCharges",
  "Actual Charges",
  "The complete amount charged for all services related to transporting your belongings from one location to another during a relocation."
);

/** Additional Charges. */

initializeGlossaryTerm(
  "gAdditionalCharges",
  "Additional Charges",
  "The expenses charged by a moving company for the various services they provide during a relocation, such as appliance servicing (for example, moving a refrigerator), unpacking assistance, and other related tasks."
);

/** Agent. */

initializeGlossaryTerm(
  "gAgent",
  "Agent",
  "A skilled professional employed by a company to provide specialized services."
);

/** Agreed Delivery Date. */

initializeGlossaryTerm(
  "gAgreedDeliveryDate",
  "Agreed Delivery Date",
  "The date agreed upon by a vendor and client for the delivery of a purchase or shipment."
);

/** Appliance Service. */

initializeGlossaryTerm(
  "gApplianceService",
  "Appliance Service",
  "The process of preparing an appliance, such as a refrigerator, washer, or dryer, prior to a move. This typically involves unplugging the appliance, draining any fluids, and securing any moving parts to ensure the appliance is safe and secure for transportation during the relocation."
);

/** Appliance Dolly. */

initializeGlossaryTerm(
  "gApplianceDolly",
  "Appliance Dolly",
  "The wheeled platform used to move appliances or heavy household items."
);

/** Assessed Value. */

initializeGlossaryTerm(
  "gAssessedValue",
  "Assessed Value",
  "The amount of funds you will need to pay based on the assessed value of your goods. This is typically measured for every 1000 units of currency."
);

/** Bill of Lading. */

initializeGlossaryTerm(
  "gBillOfLading",
  "Bill of Lading",
  "A legal document that serves as a contract between the moving company and the client. It lists all the items being transported, the agreed-upon terms of the move, and provides authorization for the moving company to handle and deliver the client's belongings. The bill of lading is signed by both the client and the moving company representative, and a copy is provided to the client."
);

/** Binding. */

initializeGlossaryTerm(
  "gBinding",
  "Binding",
  "A flat price given by a moving company regardless of the time that is taken."
);

/** Bulky Article Charge. */

initializeGlossaryTerm(
  "gBulkyArticleCharge",
  "Bulky Article Charge",
  "Especially large or cumbersome items belonging to the client can be subject to supplementary fees charged by the moving company. This is due to the specialized packing materials and handling techniques required to safely transport these types of belongings."
);

/** Cargo. */

initializeGlossaryTerm(
  "gCargo",
  "Cargo",
  "A shipment being transported by air, boat of vehicle."
);

/** Carrier. */

initializeGlossaryTerm(
  "gCarrier",
  "Carrier",
  "The moving company that a client has contracted with to facilitate their relocation and handle the transportation of their belongings."
);

/** Cartage. */

initializeGlossaryTerm(
  "gCartage",
  "Cartage",
  "The process of relocating a client's belongings from a storage facility to their final destination as part of the overall moving service."
);

/** Carton. */

initializeGlossaryTerm(
  "gCarton",
  "Carton",
  "Another term used for a moving box."
);

/** Cash on Delivery (C.O.D). */

initializeGlossaryTerm(
  "gCashOnDeliveryCOD",
  "Cash on Delivery (C.O.D)",
  "A payment arrangement where the client agrees to pay the moving company for the shipment once the goods have been delivered to the final destination."
);

/** Change Order. */

initializeGlossaryTerm(
  "gChangeOrder",
  "Change Order",
  "A document or form used to change the original estimate on your statement due to an addition or removal of services requested."
);

/** Crating. */

initializeGlossaryTerm(
  "gCrating",
  "Crating",
  "The process of packing delicate, fragile, or valuable items in a sturdy wooden crate, rather than a standard moving box. Crating provides enhanced protection and security for high-value possessions during the moving process."
);

/** Cross-Regional Move. */

initializeGlossaryTerm(
  "gCrossRegionalMove",
  "Cross-Regional Move",
  "A shipment moving between two or more regions."
);

/** Cube. */

initializeGlossaryTerm(
  "gCube",
  "Cube",
  "A measurement of volume used to quantify the space available in a moving truck, van, or container."
);

/** Cube Sheet. */

initializeGlossaryTerm(
  "gCubeSheet",
  "Cube Sheet",
  "A sheet containing measurements of household items to move."
);

/** Delivery Report. */

initializeGlossaryTerm(
  "gDeliveryReport",
  "Delivery Report",
  "A report the client signs to verify their delivery at their final destination."
);

/** Delivery Window. */

initializeGlossaryTerm(
  "gDeliveryWindow",
  "Delivery Window",
  "The window of time the movers are supposed to deliver a shipment. This can range from hours to days depending on your final location and miles traveled between destinations."
);

/** Destination Agent. */

initializeGlossaryTerm(
  "gDestinationAgent",
  "Destination Agent",
  "The agent who is designated to assist in any shipment requests or provide information and answer questions regarding a clients shipment."
);

/** Diversion. */

initializeGlossaryTerm(
  "gDiversion",
  "Diversion",
  "A situation where a client needs to change the destination of their shipment after it has already been dispatched."
);

/** Divider. */

initializeGlossaryTerm(
  "gDivider",
  "Divider",
  "A specialized equipment installed within the moving truck or van to separate and organize the transportation of a client's various belongings."
);

/** Dispatcher. */

initializeGlossaryTerm(
  "gDispatcher",
  "Dispatcher",
  "A person who communicates the route of a shipment to operators and agents."
);

/** Door to Door Service. */

initializeGlossaryTerm(
  "gDoorToDoorService",
  "Door to Door Service",
  "The act of shipping from an original destination to a final destination directly."
);

/** Elevator Charge. */

initializeGlossaryTerm(
  "gElevatorCharge",
  "Elevator Charge",
  "An additional charge during a move if items need to be transported via elevator."
);

/** En Route. */

initializeGlossaryTerm("gEnRoute", "En Route", "On the way.");

/** Essentials Box. */

initializeGlossaryTerm(
  "gEssentialsBox",
  "Essentials Box",
  "A box of essential items such as medication that should travel solely with the shipper so they have access to them at all times."
);

/** Extended Liability. */

initializeGlossaryTerm(
  "gExtendedLiability",
  "Extended Liability",
  "An additional monetary amount assigned to cover the declared value of a client's belongings while they are being transported or held in storage by the moving company."
);

/** Flight Charge. */

initializeGlossaryTerm(
  "gFlightCharge",
  "Flight Charge",
  "Also known as a stair fee. This is an additional charge for moving things up and down staircases."
);

/** Full Service Move. */

initializeGlossaryTerm(
  "gFullServiceMove",
  "Full Service Move",
  "The complete process of relocating from one residence or office to another, including all steps from start to finish such as packing belongings, loading them onto a moving truck, transporting them to the new location, unloading the truck, and unpacking items in the new space."
);

/** Furniture Blankets. */

initializeGlossaryTerm(
  "gFurnitureBlankets",
  "Furniture Blankets",
  "Soft covers designed to protect furniture from damage during a move."
);

/** Furniture Pads. */

initializeGlossaryTerm(
  "gFurniturePads",
  "Furniture Pads",
  "Pads used on the bottom of furniture to avoid scratching and scuffing floors."
);

/** Gross Weight. */

initializeGlossaryTerm(
  "gGrossWeight",
  "Gross Weight",
  "The total weight of the moving vehicle, including the weight of the shipment being transported. This represents the combined weight of the empty moving truck or van plus all the items being moved."
);

/** High Value Article. */

initializeGlossaryTerm(
  "gHighValueArticle",
  "High Value Article",
  "Items of extraordinary value."
);

/** In-Transit. */

initializeGlossaryTerm(
  "gInTransit",
  "In-Transit",
  "The status of a shipment when it is actively being transported between the origin location and the final destination."
);

/** Inventory. */

initializeGlossaryTerm(
  "gInventory",
  "Inventory",
  "A complete list of items in the shipment that will likely include quantity and condition."
);

/** Invoice. */

initializeGlossaryTerm(
  "gInvoice",
  "Invoice",
  "A bill presented to a client for an act of service."
);

/** Joint Rate. */

initializeGlossaryTerm(
  "gJointRate",
  "Joint Rate",
  "A single rate calculated by two different carriers."
);

/** Line Haul. */

initializeGlossaryTerm(
  "gLineHaul",
  "Line Haul",
  "The transportation-related revenue received by a moving company for the actual movement and delivery of a shipment from the origin to the final destination. This includes the costs associated with loading, transporting, and unloading the client's belongings."
);

/** Line Haul Charges. */

initializeGlossaryTerm(
  "gLineHaulCharges",
  "Line Haul Charges",
  "Tariffs and fees imposed by a long distance move."
);

/** Load Date. */

initializeGlossaryTerm(
  "gLoadDate",
  "Load Date",
  "The specific date on which a moving company representative collects a client's belongings from their origin location to begin the transportation process."
);

/** Local Move. */

initializeGlossaryTerm(
  "gLocalMove",
  "Local Move",
  "A move that takes place within a limited geographical area, such as within the same city, county, or zip code."
);

/** Long Carry Fee. */

initializeGlossaryTerm(
  "gLongCarryFee",
  "Long Carry Fee",
  "An additional charge that occurs when the distance from the end of the moving van and the delivery destination exceeds 25 meters."
);

/** Long Term Storage. */

initializeGlossaryTerm(
  "gLongTermStorage",
  "Long Term Storage",
  "The extended storage of a client's belongings by a moving company for a period longer than the initial 30-day timeframe."
);

/** Moving Company. */

initializeGlossaryTerm(
  "gMovingCompany",
  "Moving Company",
  "A company that facilitates the transportation of a client's belongings from their original location (point A) to their new destination (point B), offering comprehensive assistance throughout the moving process."
);

/** Moving Cost. */

initializeGlossaryTerm(
  "gMovingCost",
  "Moving Cost",
  "The cost charged by the moving company solely for the transportation of the client's household goods, excluding any additional fees such as the cost of insurance coverage."
);

/** Net Weight. */

initializeGlossaryTerm(
  "gNetWeight",
  "Net Weight",
  "The actual weight of shipment subtracting the 'tare weight' or weight of the truck."
);

/** Non-Binding Estimate. */

initializeGlossaryTerm(
  "gNonBindingEstimate",
  "Non-Binding Estimate",
  "The carriers estimated cost based on the estimated weight of a shipment."
);

/** Origin Agent. */

initializeGlossaryTerm(
  "gOriginAgent",
  "Origin Agent",
  "The agent that is dedicated in our origin area to help with a clients shipment service."
);

/** Pallet. */

initializeGlossaryTerm(
  "gPallet",
  "Pallet",
  "A portable platform used for storage and transportation."
);

/** Peak Season-Rate. */

initializeGlossaryTerm(
  "gPeakSeasonRate",
  "Peak&nbsp;Season-Rate",
  "A higher rate or fee charged by a moving company during certain times of the year, such as the summer months, when moving demand and volume is typically higher. These peak season rates account for factors like increased labor costs, equipment usage, and logistical challenges due to the high volume of moves occurring."
);

/** Permanent Storage. */

initializeGlossaryTerm(
  "gPermanentStorage",
  "Permanent Storage",
  "The storage of goods indefinitely in a warehouse."
);

/** Preferred Arrival Date (P.A.D). */

initializeGlossaryTerm(
  "gPreferredArrivalDatePAD",
  "Preferred Arrival Date (P.A.D)",
  "The date a client requests to have goods arrive to their final destination by."
);

/** Quote. */

initializeGlossaryTerm(
  "gQuote",
  "Quote",
  "An estimate for the cost of a move."
);

/** Relocation Assistance. */

initializeGlossaryTerm(
  "gRelocationAssistance",
  "Relocation Assistance",
  "A service provided by an employer for relocating due to a job."
);

/** Routing. */

initializeGlossaryTerm(
  "gRouting",
  "Routing",
  "The specific transportation route or method selected by the client when there are multiple options available for moving their belongings from one location to another."
);

/** Short Haul. */

initializeGlossaryTerm(
  "gShortHaul",
  "Short Haul",
  "A shipment that is less than 500 kilometers."
);

/** Shuttle Service. */

initializeGlossaryTerm(
  "gShuttleService",
  "Shuttle Service",
  "The service of a smaller vehicle to access areas that a large truck could not."
);

/** Storage In Transit (S.I.T). */

initializeGlossaryTerm(
  "gStorageInTransitSIT",
  "Storage In Transit (S.I.T)",
  "Temporary storage of goods in the warehouse of the carriers agent pending further transportation."
);

/** Stretch Wrap. */

initializeGlossaryTerm(
  "gStretchWrap",
  "Stretch Wrap",
  "The protective wrapping or padding materials utilized by the moving company's personnel to securely cover and safeguard the client's furniture during transportation."
);

/** Survey. */

initializeGlossaryTerm(
  "gSurvey",
  "Survey",
  "The process undertaken by a moving company representative, or agent, to assess a client's possessions and provide an estimated cost for the relocation services based on the volume, weight, and other factors of the client's belongings."
);

/** Tag. */

initializeGlossaryTerm(
  "gTag",
  "Tag",
  "A unique identification label, typically consisting of a number and/or color coding, that is affixed to each individual box, container, or item being transported during a move to facilitate organization and tracking of the client's belongings."
);

/** Tare Weight. */

initializeGlossaryTerm(
  "gTareWeight",
  "Tare Weight",
  "The baseline weight of the moving truck or vehicle before any client belongings or shipments are loaded. This 'empty' weight is used as a reference point to calculate the total weight of the move once the client's items have been loaded onto the vehicle."
);

/** Unpacking. */

initializeGlossaryTerm(
  "gUnpacking",
  "Unpacking",
  "The process of unpacking or removing a client's belongings from their original storage containers or packaging as part of the moving company's service offerings."
);

/** Van Foreman. */

initializeGlossaryTerm(
  "gVanForeman",
  "Van Foreman",
  "The moving company employee who is tasked with overseeing the loading, secure transport, and unloading of the client's belongings during the relocation process."
);

/** Van Line. */

initializeGlossaryTerm(
  "gVanLine",
  "Van Line",
  "A network of agents employed by a moving company to coordinate and facilitate packing, transport, storage and delivery services for clients' relocations."
);
