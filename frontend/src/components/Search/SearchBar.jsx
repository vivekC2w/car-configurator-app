import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../context/SearchContext';
import { searchModels, searchVariants, searchAccessories } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSearch }) {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    setSearchResults,
    setIsSearching
  } = useSearch();
  
  const [activeTab, setActiveTab] = useState('models');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults({ models: [], variants: [], accessories: [] });
      return;
    }
    
    setIsSearching(true);
    
    try {
      let results;
      console.log("Active Tabs->", activeTab);
      if (activeTab === 'models') {
        results = await searchModels(searchQuery, {
          minVariantPrice: filters.minPrice,
          maxVariantPrice: filters.maxPrice
        });
        console.log("Results->", results);
        setSearchResults({ models: results.data || [], variants: [], accessories: [] });
      } 
      else if (activeTab === 'variants') {
        results = await searchVariants(searchQuery, filters);
        setSearchResults({ variants: results.data || [], models: [], accessories: [] });
      }
      else if (activeTab === 'accessories') {
        results = await searchAccessories(searchQuery, {
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
        setSearchResults({ accessories: results.data || [], models: [], variants: [] });
      }
      navigate('/search');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, filters, activeTab]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
        {['models', 'variants', 'accessories'].map((tab) => (
          <button 
            key={tab}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(tab);
            }}
            style={{ 
              padding: '5px 10px',
              background: activeTab === tab ? '#4CAF50' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Search input */}
      <input
        ref={inputRef}
        type="text"
        placeholder={`Search ${activeTab}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #444',
          backgroundColor: '#222',
          color: 'white',
          marginBottom: '10px'
        }}
      />
      
      {/* Filters */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
          Price Range:
        </label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              flex: 1, 
              padding: '5px', 
              borderRadius: '4px', 
              border: '1px solid #444',
              backgroundColor: '#222',
              color: 'white'
            }}
          />
          <span style={{ color: '#ccc' }}>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              flex: 1, 
              padding: '5px', 
              borderRadius: '4px', 
              border: '1px solid #444',
              backgroundColor: '#222',
              color: 'white'
            }}
          />
        </div>
        
        {activeTab === 'accessories' && (
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
              Category:
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', 
                padding: '5px', 
                borderRadius: '4px', 
                border: '1px solid #444',
                backgroundColor: '#222',
                color: 'white'
              }}
            >
              <option value="">All Categories</option>
              <option value="Exterior">Exterior</option>
              <option value="Interior">Interior</option>
              <option value="Performance">Performance</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
        )}
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          resetFilters();
          setSearchQuery('');
        }}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: '1px solid #444',
          backgroundColor: '#333',
          color: 'white',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}