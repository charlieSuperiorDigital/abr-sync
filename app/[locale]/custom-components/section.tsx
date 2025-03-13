import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  description?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, description }) => {
  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
      {children}
      <hr className="my-4" />
    </div>
  );
};

export default Section;
