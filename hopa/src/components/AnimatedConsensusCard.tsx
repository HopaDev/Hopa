import ConsensusCard from './ConsensusCard';

interface AnimatedConsensusCardProps {
  title: string;
  description: string;
}

export default function AnimatedConsensusCard({ title, description }: AnimatedConsensusCardProps) {
  return (
    <div className="mb-4 px-4 opacity-0 animate-fade-in-consensus">
      <ConsensusCard title={title} description={description} />
    </div>
  );
}
