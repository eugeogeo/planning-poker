import { useState } from 'react';
import { Box, Typography, Tooltip, Zoom } from '@mui/material';
import { CARD_COLORS } from '../../../@types/enum';

interface VotesPieChartProps {
  votes: string[];
}

const VotesPieChart = ({ votes }: VotesPieChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const voteCounts = votes.reduce(
    (acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalVotes = votes.length;
  const data = Object.entries(voteCounts).map(([label, count]) => ({
    label,
    count,
    percentage: ((count / totalVotes) * 100).toFixed(1),
    color: CARD_COLORS[label as keyof typeof CARD_COLORS] || '#ccc',
  }));

  // Identificar o vencedor
  const winner = data.reduce(
    (prev, current) =>
      parseFloat(current.percentage) > parseFloat(prev.percentage) ? current : prev,
    data[0],
  );

  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
      {/* Badge de Vencedor */}
      {winner && (
        <Box
          sx={{
            bgcolor: winner.color,
            color: '#000',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: '900',
            fontSize: '0.75rem',
            mb: 2,
            boxShadow: `0 0 15px ${winner.color}`,
            animation: 'pulse 2s infinite',
          }}
        >
          VENCEDOR: {winner.label} ({winner.percentage}%)
        </Box>
      )}

      <Box sx={{ position: 'relative', width: 140, height: 140 }}>
        <svg
          viewBox="-1.1 -1.1 2.2 2.2" // Aumentado levemente para não cortar o "salto"
          style={{
            transform: 'rotate(-90deg)',
            width: '100%',
            height: '100%',
            overflow: 'visible',
          }}
        >
          <title>Votes distribution pie chart</title>
          {data.map((slice, index) => {
            const startPercent = cumulativePercent;
            const [startX, startY] = getCoordinatesForPercent(startPercent);

            const slicePercent = slice.count / totalVotes;
            cumulativePercent += slicePercent;

            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'L 0 0',
            ].join(' ');

            const isHovered = hoveredIndex === index;

            return (
              <Tooltip
                key={index.toString()}
                title={`${slice.label}: ${slice.percentage}% (${slice.count} votos)`}
                arrow
                slots={{ transition: Zoom }}
              >
                {/** biome-ignore lint/a11y/useSemanticElements: O elemento <a> é usado dentro do SVG para permitir interatividade e foco via teclado nas fatias do gráfico. */}
                {/** biome-ignore lint/a11y/useValidAnchor: O href='#' é obrigatório para a semântica do âncora no SVG; o evento de clique é tratado com preventDefault. */}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer', outline: 'none' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setHoveredIndex(index);
                    }
                  }}
                >
                  <path
                    d={pathData}
                    fill={slice.color}
                    stroke="#fff"
                    strokeWidth="0.02"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      filter: isHovered ? 'brightness(1.2)' : 'none',
                    }}
                  />
                </a>
              </Tooltip>
            );
          })}
        </svg>
      </Box>

      {/* Legenda */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mt: 2 }}>
        {data.map((slice, index) => (
          <Box
            key={index.toString()}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
              transition: 'opacity 0.3s',
            }}
          >
            <Box sx={{ width: 10, height: 10, bgcolor: slice.color, borderRadius: '50%' }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
              {slice.label}: {slice.percentage}%
            </Typography>
          </Box>
        ))}
      </Box>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default VotesPieChart;
