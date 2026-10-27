import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addToCart, clearCart, removeFromCart } from '../slices/cartSlice';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';

function CartScreen() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
  
    const handleAdd = () => {
      dispatch(addToCart({ id: Date.now(), name: 'Laptop', price: 1000 }));
    };
  
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Giỏ Hàng Cơ Bản</Text>
        <Button title="Thêm Laptop" onPress={handleAdd} />
  
        <Text style={{ marginTop: 20, fontSize: 18 }}>
          Sản phẩm: {cartItems.length}
        </Text>
  
        <ScrollView>
          {cartItems.map(item => (
            <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
              <Text>{item.name} - ${item.price}</Text>
              <Button title="Xóa" onPress={() => dispatch(removeFromCart(item.id))} />
            </View>
          ))}
        </ScrollView>
  
        <Button title="Xóa Tất Cả" onPress={() => dispatch(clearCart())} />
      </SafeAreaView>
    );
}

export default CartScreen
