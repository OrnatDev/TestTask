import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { shallow } from 'zustand/shallow'
import { useStore } from './store';
import { Autocomplete, TextField } from '@mui/material';
import './App.css';



function App() {
  const [values, setValues] = useState<any[]>([])
  const { setItems, items } = useStore(({setItems, items}: any) => ({ setItems, items }), shallow)
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([]);
  const [isAutocompleteActive, setIsAutocompleteActive] = useState(false)
  const inputRef = useRef(null);

  const { isLoading, error, data } = useQuery('todos', () =>
      fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete')
        .then(response => response.json()).then(data => setItems(data.map((it: any) => ({ label: it.name, id: it.id }) )))
  );

  const onHandleAutocomplete = (input: any) => {
    if(/[+\-*\/()^]/.exec(input)) { setInputValue(''); setValues(prev => [...prev, { type: 'operand', label: input }]); }
    setInputValue(input)
    if (input) setSuggestions(items.filter((it: any) => it.label.includes(input)))
    setIsAutocompleteActive(true)
  }

  const handleAutocompleteSelect = (input: string, id: string) => {
    setInputValue(input)
    setSuggestions([])
    setValues(prev => [...prev, { label: input, id, type: 'tag' }])
    setIsAutocompleteActive(false)
    setInputValue('')
  }

  return (
      <div style={{ display: 'flex', gap: 4, flexDirection: 'row', justifyContent: 'center', marginTop: 50 }} className="App">
        { 
          values.map((it: any, index) => <div style={{ height: 20, backgroundColor: it.type === 'tag' ? 'gray': '' }}>{
            it.label}
            <span style={{ backgroundColor: 'red' }} onClick={() => { setValues((prev) => prev.filter((it, i) => i !== index )) }}>x</span>  
          </div>)
          
        }

        { 
          (
            <div>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => { onHandleAutocomplete(e.target.value) }}
              ></input>
              {
                isAutocompleteActive && (
                  <ul className="suggestions">
                    {suggestions.map((suggestion: any) => (
                      <li key={suggestion.id} onClick={() => handleAutocompleteSelect(suggestion.label, suggestion.id)}>
                        {suggestion.label}
                      </li>
                    ))}
                  </ul>
                )
              }
            </div>
          )
        }
      </div>
  );
}

export default App;
