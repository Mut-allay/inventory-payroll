import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { UserData } from '@/types';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export const useCurrentUser = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() } as UserData;
      }
      return null;
    },
    enabled: !!userId
  });
};
