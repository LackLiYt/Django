export default function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
      />
      <div 
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl"
      />
      <div 
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl"
      />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
