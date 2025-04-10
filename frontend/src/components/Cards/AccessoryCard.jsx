export default function AccessoryCard({ accessory }) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        transition: 'all 0.3s',
        ':hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        }
      }}>
        <img
          src={accessory.image}
          alt={accessory.name}
          style={{
            width: '100%',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '10px'
          }}
        />
        <h4 style={{ 
          margin: '8px 0', 
          color: '#fff',
          fontSize: '1.1rem'
        }}>
          {accessory.name}
        </h4>
        <p style={{ 
          color: '#4CAF50',
          fontWeight: 'bold',
          margin: '5px 0'
        }}>
          ₹{accessory.price?.toLocaleString()}
        </p>
        <p style={{ 
          color: '#aaa',
          fontSize: '0.9rem',
          margin: '5px 0'
        }}>
          {accessory.category}
        </p>
      </div>
    );
  }