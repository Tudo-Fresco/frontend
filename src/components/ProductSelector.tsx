import { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";

type Product = {
  id: string;
  name: string;
};

type ProductSelectorProps = {
  onSelect: (product: Product | null) => void;
};

export default function ProductSelector({ onSelect }: ProductSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products"); // Mude aqui para sua rota real
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Autocomplete
      value={selectedProduct}
      onChange={(_, newValue) => {
        setSelectedProduct(newValue);
        onSelect(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      getOptionLabel={(option) => option.name}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Selecione um produto"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </Box>
            ),
          }}
        />
      )}
    />
  );
}
