import { useSearch } from '../context/SearchContext';
import LoadingSpinner from '../components/ReusableComponents/LoadingSpinner/LoadingSpinner';
import ModelCard from '../components/Cards/ModelCard';
import VariantCard from '../components/Cards/VariantCard';
import AccessoryCard from '../components/Cards/AccessoryCard';

export default function SearchResults() {
  const { searchResults, isSearching } = useSearch();
  
  if (isSearching) return <LoadingSpinner />;
  
  // Only show sections that have results
  const hasModels = searchResults.models.length > 0;
  const hasVariants = searchResults.variants.length > 0;
  const hasAccessories = searchResults.accessories.length > 0;
  
  if (!hasModels && !hasVariants && !hasAccessories) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        color: '#666',
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>No results found</h2>
        <p>Try adjusting your search query or filters</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '20px', position: 'sticky', top: '0', zIndex: '10', padding: '10px 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>Search Results</h2>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '60px' }}>
      {hasModels && (
        <section style={{ marginBottom: '40px' }}>
          <h3>Models ({searchResults.models.length})</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '15px'
          }}>
            {searchResults.models.map(model => (
              <ModelCard key={model._id} model={model} />
            ))}
          </div>
        </section>
      )}
      
      {hasVariants && (
        <section style={{ marginBottom: '40px' }}>
          <h3>Variants ({searchResults.variants.length})</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '15px'
          }}>
            {searchResults.variants.map(variant => (
              <VariantCard key={variant._id} variant={variant} />
            ))}
          </div>
        </section>
      )}
      
      {hasAccessories && (
        <section style={{ marginBottom: '40px' }}>
          <h3>Accessories ({searchResults.accessories.length})</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '15px'
          }}>
            {searchResults.accessories.map(accessory => (
              <AccessoryCard key={accessory._id} accessory={accessory} />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}