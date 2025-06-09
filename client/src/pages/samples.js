import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeIcon from '@mui/icons-material/QrCode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import sampleApi from '../api/sampleApi';

const SamplesList = () => {
  const router = useRouter();
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(router.query?.message || '');

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        setLoading(true);
        const response = await sampleApi.getAllSamples();
        
        if (response.success) {
          // Sort samples by created_at date (newest first)
          const sortedSamples = response.data.sort((a, b) => {
            const dateA = a.created_at?.toDate?.() || new Date(a.created_at);
            const dateB = b.created_at?.toDate?.() || new Date(b.created_at);
            return dateB - dateA;
          });
          
          setSamples(sortedSamples);
          setFilteredSamples(sortedSamples);
        } else {
          setError('Failed to load samples');
        }
      } catch (err) {
        console.error('Error fetching samples:', err);
        setError('An error occurred while fetching samples');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSamples();
  }, []);

  // Filter samples when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSamples(samples);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = samples.filter(sample => 
        sample.style_id.toLowerCase().includes(term) ||
        sample.packaging.type.toLowerCase().includes(term) ||
        sample.available_colors.some(color => color.toLowerCase().includes(term))
      );
      setFilteredSamples(filtered);
    }
  }, [searchTerm, samples]);

  // Clear location state message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        router.push('/samples', { query: { message: '' } });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">All Samples</Typography>
        <Button
          variant="contained"
          component={Link}
          href="/samples/new"
          startIcon={<AddIcon />}
        >
          Add New Sample
        </Button>
      </Box>
      
      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by Style ID, packaging type, or color"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredSamples.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Style ID</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Colors</TableCell>
                <TableCell>Packaging</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSamples.map((sample) => (
                <TableRow key={sample.style_id} hover>
                  <TableCell>
                    {sample.images && sample.images.length > 0 ? (
                      <Tooltip title="View sample details">
                        <Avatar
                          component={Link}
                          href={`/samples/${sample.style_id}`}
                          src={sample.images[0].preview}
                          alt={sample.style_id}
                          variant="rounded"
                          sx={{
                            width: 48,
                            height: 48,
                            cursor: 'pointer',
                            border: '1px solid #eee',
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <ImageIcon color="action" />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1" fontWeight={500}>
                      {sample.style_id}
                    </Typography>
                  </TableCell>
                  <TableCell>${sample.price?.toFixed(2)}</TableCell>
                  <TableCell>{sample.quantity}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                      {sample.available_colors.slice(0, 3).map((color) => (
                        <Chip
                          key={color}
                          label={color}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {sample.available_colors.length > 3 && (
                        <Chip
                          label={`+${sample.available_colors.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{sample.packaging.type}</TableCell>
                  <TableCell>
                    {new Date(sample.created_at?.seconds ? sample.created_at.seconds * 1000 : sample.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        component={Link}
                        href={`/samples/${sample.style_id}`}
                        startIcon={<VisibilityIcon />}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        component={Link}
                        href={`/samples/${sample.style_id}`}
                        startIcon={<QrCodeIcon />}
                        size="small"
                        variant="outlined"
                      >
                        QR
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">
          {searchTerm ? 'No samples found matching your search criteria' : 'No samples found. Create your first sample by clicking "Add New Sample".'}
        </Alert>
      )}
    </Box>
  );
};

export default SamplesList; 