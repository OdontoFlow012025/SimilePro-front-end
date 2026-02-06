"use client";


interface ToothProps {
  id: number;
  x: number;
  y: number;
  data: Record<string, string>; // face -> status/color
  onFaceClick: (face: string) => void;
  label?: string;
  dictionary: any;
}

// Geometric Tooth Representation (Classic 5 distinct faces)
// We draw this relative to x,y center
export const Tooth = ({ id, x, y, data, onFaceClick, label, dictionary }: ToothProps) => {
  const size = 32; // Total width/height
  const half = size / 2;
  const centerSize = 10;
  
  const dict = dictionary?.dashboard?.medical?.odontogram?.faces;

  // Define faces paths relative to center (0,0)
  // We use a simple layout: Central circle (Occlusal) + 4 Trapezoids
  
  // Occlusal (Center)
  const getStatusColor = (status?: string) => {
      switch(status) {
          case 'cavity': return "#ef4444"; // red-500
          case 'restoration': return "#3b82f6"; // blue-500
          case 'missing': return "#1f2937"; // gray-800
          case 'crown': return "#eab308"; // yellow-500
          default: return "white";
      }
  };

  const faces = [
      { id: 'O', name: dict?.O || 'Oclusal', path: `M -5 -5 L 5 -5 L 5 5 L -5 5 Z`, color: getStatusColor(data['O']) },
      { id: 'V', name: dict?.V || 'Vestibular', path: `M -5 -5 L -15 -15 L 15 -15 L 5 -5 Z`, color: getStatusColor(data['V']) }, // Top
      { id: 'L', name: dict?.L || 'Lingual', path: `M -5 5 L -15 15 L 15 15 L 5 5 Z`, color: getStatusColor(data['L']) }, // Bottom
      { id: 'M', name: dict?.M || 'Mesial', path: `M -5 -5 L -5 5 L -15 15 L -15 -15 Z`, color: getStatusColor(data['M']) }, // Left (relative)
      { id: 'D', name: dict?.D || 'Distal', path: `M 5 -5 L 15 -15 L 15 15 L 5 5 Z`, color: getStatusColor(data['D']) }, // Right (relative)
  ];

  return (
    <g transform={`translate(${x}, ${y})`}>
        {/* Faces */}
        {faces.map(face => (
            <path
                key={face.id}
                d={face.path}
                fill={face.color}
                stroke="#9ca3af"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onFaceClick(face.id)}
            >
                <title>{`${dictionary?.dashboard?.medical?.odontogram?.toothLabel || "Dente"} ${label || id} - ${face.name}`}</title>
            </path>
        ))}
        {/* Tooth Number Label */}
        <text y={25} textAnchor="middle" fontSize="10" className="fill-gray-500 font-bold select-none">
            {label || id}
        </text>
    </g>
  );
};
