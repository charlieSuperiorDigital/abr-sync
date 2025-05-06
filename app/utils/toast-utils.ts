
import { toast } from 'react-toastify';
import { OpportunityResponse } from '../types/opportunities';

// Toast for archiving an opportunity
export const showArchiveToast = (opportunity: OpportunityResponse) => {
  const vehicleInfo = `${opportunity.vehicleYear} ${opportunity.vehicleMake} ${opportunity.vehicleModel}`;
  
  toast.success(`Archived: ${vehicleInfo}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Toast for unarchiving an opportunity
export const showUnarchiveToast = (opportunity: OpportunityResponse) => {
  const vehicleInfo = `${opportunity.vehicleYear} ${opportunity.vehicleMake} ${opportunity.vehicleModel}`;
  const statusInfo = opportunity.opportunityStatus ? ` (${opportunity.opportunityStatus})` : '';
  
  toast.info(`Unarchived: ${vehicleInfo}${statusInfo}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Toast for marking a vehicle as picked up
export const showPickupToast = (opportunity: OpportunityResponse) => {
  const vehicleInfo = `${opportunity.vehicleYear} ${opportunity.vehicleMake} ${opportunity.vehicleModel}`;
  
  toast.success(`Vehicle Picked Up: ${vehicleInfo}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
