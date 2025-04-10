export default function VariantCard({ variant }) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        padding: '15px',
        transition: 'all 0.3s',
        ':hover': {
          transform: 'scale(1.03)',
          backgroundColor: 'rgba(255,255,255,0.15)'
        }
      }}>
        <h4 style={{
          fontSize: '1.2rem',
          margin: '0 0 10px 0',
          color: '#fff'
        }}>
          {variant.name}
        </h4>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <span style={{
            color: '#4CAF50',
            fontWeight: 'bold'
          }}>
            ₹{variant.price?.toLocaleString()}
          </span>
          <span style={{
            color: '#ccc',
            fontSize: '0.8rem'
          }}>
            {variant.colors?.length} colors
          </span>
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '10px'
        }}>
          {variant.colors?.slice(0, 3).map(color => (
            <div
              key={color._id}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: color.hexCode,
                borderRadius: '50%',
                border: '1px solid #fff'
              }}
              title={color.name}
            />
          ))}
          {variant.colors?.length > 3 && (
            <span style={{
              color: '#aaa',
              fontSize: '0.8rem'
            }}>
              +{variant.colors.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  }