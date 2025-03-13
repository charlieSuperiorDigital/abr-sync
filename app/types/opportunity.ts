export type Opportunity = {
    opportunityId: string; // Unique identifier for the opportunity
    status: 
      | "New" // Initial contact with customer to schedule drop date
      | "2nd Call" // Follow-up if customer doesn't respond
      | "Estimate" // When estimate is created and approved
      | "Total Loss" // If vehicle is declared total loss
      | "Archived"; // Vehicle picked up, opportunity lifecycle ends
    createdDate: string; // Date the opportunity was created (ISO format)
    lastUpdatedDate: string; // Date the opportunity was last updated (ISO format)
    priority: "Normal" | "High"; // Priority level
    vehicle: {
      vin: string; // Vehicle Identification Number
      make: string; // Vehicle make (e.g., Toyota)
      model: string; // Vehicle model (e.g., Camry)
      year: number; // Vehicle year
      licensePlate: string; // License plate number
      exteriorColor: string; // Exterior color
      interiorColor: string; // Interior color
      mileageIn: number; // Mileage when the vehicle was checked in
    };
    customer: {
      name: string; // Customer name
      phone: string; // Customer phone number
      email: string; // Customer email
      address: string; // Customer address
    };
    insurance: {
      company: string; // Insurance company (e.g., Progressive)
      claimNumber: string; // Claim number
      policyNumber: string; // Policy number
      deductible: number; // Deductible amount
      typeOfLoss: string; // Type of loss (e.g., Collision, Hail Damage)
    };
    dropDate?: string; // Scheduled drop date (ISO format)
    lastCommunicationSummary?: string; // Summary of the last communication
    isInRental?: boolean; // Indicates if the customer is using a rental vehicle
    isTotalLoss?: boolean; // Indicates if the vehicle is declared a total loss
    isVoilComplete?: boolean; // Indicates if VOIL (VIN, Odometer, Interior, License Plate) is complete
    is4CornersComplete?: boolean; // Indicates if the four corners of the vehicle have been inspected
  };