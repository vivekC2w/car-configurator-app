export default function ModelCard({ model }) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '20px',
        transition: 'all 0.3s',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          backgroundColor: 'rgba(255,255,255,0.15)'
        }
      }}>
        {model.image && (
          <img
            src={model.image}
            alt={model.name}
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '15px'
            }}
          />
        )}
        <h3 style={{
          fontSize: '1.5rem',
          margin: '10px 0',
          color: '#fff'
        }}>
          {model.name}
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '15px'
        }}>
          <span style={{
            color: '#2EFF2E',
            fontWeight: 'bold',
            textShadow: '0 0 2px white'
          }}>
            Starting at ₹{model?.price?.toLocaleString()}
          </span>
          <span style={{
            color: '#ccc',
            fontSize: '0.8rem'
          }}>
            {model.variants?.length} variants
          </span>
        </div>
      </div>
    );
  }