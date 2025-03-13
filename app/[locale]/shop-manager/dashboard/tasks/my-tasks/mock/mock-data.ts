export interface MyTasks {
    id: string
    priority: {
        variant: 'default' | 'danger' | 'warning' | 'neutral' | 'slate' | 'info' | 'success' | 'forest' | 'dark'
        text: string
    }
    title: string
    description: string
    createdBy: string
    createdDate: string
    due: string
    relatedTo: string
    email: string
    phone: string
    message: string

  }
  export function mapTasksData(data: any): MyTasks {


    return {
        id: data.id,
        priority: data.priority,
        title: data.title,
        description: data.description,
        createdBy: data.createdBy,
        createdDate: data.createdDate,
        due: data.due,
        relatedTo: data.relatedTo,
        email: data.email,
        phone: data.phone,
        message: data.message,

    }
  }
  
  export const mockTasks: MyTasks[] = [
    {
        id: '473829',
        priority: {
            variant: 'danger',
            text: 'URGENT'
        },
        title: 'Insurance Documentation Validation',
        description: 'Verify all paperwork required by the insurance provider',
        createdBy: 'Charlie Thompson',
        createdDate: '2021-09-01',
        due: '2021-09-15',
        relatedTo: 'Insurance, Progressive',
        email: 'charliethompson@xpto.com',
        phone: '123-456-7890',
        message: '27'
    },
    {
        id: '928374',
        priority: {
            variant: 'warning',
            text: 'HIGH'
        },
        title: 'Engine Maintenance Check',
        description: 'Perform routine engine diagnostics and maintenance',
        createdBy: 'Me',
        createdDate: '2025-03-11',
        due: '2025-09-15',
        relatedTo: 'Workfile, RO #301904',
        email: 'charliethompson@xpto.com',
        phone: '123-456-7890',
        message: '27'
    },
    {
        id: '184956',
        priority: {
            variant: 'success',
            text: 'NORMAL'
        },
        title: 'Customer Approval Review',
        description: 'Call Mrs. Jane to confirm the additional cost for the bumper replacement',
        createdBy: 'Tom Mitchell',
        createdDate: '2025-03-11',
        due: '2025-09-15',
        relatedTo: 'Workfile, RO #301904',
        email: 'charliethompson@xpto.com',
        phone: '123-456-7890',
        message: '27'
    },
    {
        id: '561042',
        priority: {
            variant: 'success',
            text: 'NORMAL'
        },
        title: 'Oporunity Assessment',
        description: 'Discuss the potential repair or service needs with a new client',
        createdBy: 'Tom Mitchell',
        createdDate: '2025-03-11',
        due: '2025-09-15',
        relatedTo: 'Opportunity, Claim',
        email: 'charliethompson@xpto.com',
        phone: '123-456-7890',
        message: '27'
    },
    {
        id: '307815',
        priority: {
            variant: 'slate',
            text: 'LOW'
        },
        title: 'Parts Vendor Confirmation',
        description: 'Confirm parts availability with vendors',
        createdBy: 'Tom Mitchell',
        createdDate: '2025-03-11',
        due: '2025-09-15',
        relatedTo: 'Opportunity, Claim',
        email: 'charliethompson@xpto.com',
        phone: '123-456-7890',
        message: '27'
    }
  ]
  