import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaletteIcon from '@mui/icons-material/Palette';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import sampleApi from '../api/sampleApi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSamples: 0,
    totalColors: 0,
    averagePrice: 0,
  });
  const [recentSamples, setRecentSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await sampleApi.getAllSamples();
        
        if (response.success) {
          const samples = response.data;
          
          // Calculate stats
          const totalSamples = samples.length;
          
          // Get unique colors across all samples
          const allColors = samples.flatMap(sample => sample.available_colors);
          const uniqueColors = new Set(allColors);
          const totalColors = uniqueColors.size;
          
          // Calculate average price
          const totalPrice = samples.reduce((sum, sample) => sum + (sample.price || 0), 0);
          const averagePrice = totalSamples > 0 ? totalPrice / totalSamples : 0;
          
          setStats({
            totalSamples,
            totalColors,
            averagePrice,
          });
          
          // Get recent samples (latest 5)
          const sortedSamples = [...samples].sort((a, b) => {
            const dateA = a.created_at?.toDate?.() || new Date(a.created_at);
            const dateB = b.created_at?.toDate?.() || new Date(b.created_at);
            return dateB - dateA;
          });
          
          setRecentSamples(sortedSamples.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Link href="/samples/new" passHref>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add New Sample
          </Button>
        </Link>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" color="primary.main">
                  {stats.totalSamples}
                </Typography>
                <Typography variant="subtitle1">Total Samples</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PaletteIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" color="secondary.main">
                  {stats.totalColors}
                </Typography>
                <Typography variant="subtitle1">Unique Colors</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" color="success.main">
                  ${stats.averagePrice.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1">Average Price</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Samples */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recent Samples
      </Typography>
      
      {recentSamples.length > 0 ? (
        <Grid container spacing={2}>
          {recentSamples.map((sample) => (
            <Grid item xs={12} key={sample.style_id}>
              <Link href={`/samples/${sample.style_id}`} passHref style={{ textDecoration: 'none' }}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'center' },
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" color="primary.main">
                      {sample.style_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(sample.created_at?.seconds ? sample.created_at.seconds * 1000 : sample.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, sm: 0 } }}>
                    <Typography variant="body1" sx={{ mr: 3 }}>
                      ${sample.price?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 3 }}>
                      Qty: {sample.quantity}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', maxWidth: 200 }}>
                      {sample.available_colors.slice(0, 3).map((color) => (
                        <Typography
                          key={color}
                          variant="body2"
                          sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.08)',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mr: 0.5,
                            mb: 0.5,
                          }}
                        >
                          {color}
                        </Typography>
                      ))}
                      {sample.available_colors.length > 3 && (
                        <Typography
                          variant="body2"
                          sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.08)',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mr: 0.5,
                            mb: 0.5,
                          }}
                        >
                          +{sample.available_colors.length - 3} more
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">
          No samples found. Create your first sample by clicking "Add New Sample".
        </Alert>
      )}
      
      {recentSamples.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Link href="/samples" passHref>
            <Button variant="outlined">
              View All Samples
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard; 