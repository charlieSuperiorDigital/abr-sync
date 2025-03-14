import { toast } from 'react-toastify';
import { Opportunity } from '../types/opportunity';

// Toast for archiving an opportunity
export const showArchiveToast = (opportunity: Opportunity) => {
  const vehicleInfo = `${opportunity.vehicle.year} ${opportunity.vehicle.make} ${opportunity.vehicle.model}`;
  
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
export const showUnarchiveToast = (opportunity: Opportunity) => {
  const vehicleInfo = `${opportunity.vehicle.year} ${opportunity.vehicle.make} ${opportunity.vehicle.model}`;
  const statusInfo = opportunity.status ? ` (${opportunity.status})` : '';
  
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
export const showPickupToast = (opportunity: Opportunity) => {
  const vehicleInfo = `${opportunity.vehicle.year} ${opportunity.vehicle.make} ${opportunity.vehicle.model}`;
  
  toast.success(`Vehicle Picked Up: ${vehicleInfo}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
