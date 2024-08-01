// src/App.jsx
import { useState, useEffect } from 'react';
import * as petService from './services/petServices';

import PetList from './components/PetList';
import PetDetails from './components/PetDetails';
import PetForm from './components/PetForm';

import './App.css';

const App = () => {
  const [petList, setPetList] = useState([])
  const [selected, setSelected] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const pets = await petService.index()

        if (pets.err) {
          throw new Error(pets.err)
        }
  
        setPetList(pets)
      } catch (err) {
        console.log(err)
      }
    }
    fetchPets()
  }, [])

  const updateSelected = (pet) => {
    setSelected(pet)
  }

  const handleFormView = (pet) => {
    if (!pet.name) setSelected(null)
      setIsFormOpen(!isFormOpen)
  }

  const handleAddPet = async (formData) => {
    try {
      const newPet = await petService.create(formData)
      if (newPet.err) {
        throw new Error(newPet.err)
      }
      setPetList([newPet, ...petList])
      setIsFormOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdatePet = async (formData, petId) => {
    try {
        const updatePet = await petService.updatePet(formData, petId)
        if (updatePet.err) {
          throw new Error(updatePet.err)
        }

        const updatedPetList = petList.map((pet) => 
        pet._id !== updatePet._id ? pet : updatePet 
      )
        setPetList(updatedPetList)
        setSelected(updatePet)
        setIsFormOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeletePet = async (petId) => {
    try {
        const deletedPet = await petService.deletePet(petId)
        if (deletedPet.err) {
          throw new Error(deletedPet.err)
        }
        setPetList(petList.filter((pet) => pet._id !== deletedPet._id))
        setSelected(null)
        setIsFormOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
  <>
    <PetList 
      petList={petList} 
      updateSelected={updateSelected}
      handleFormView={handleFormView}
      isFormOpen={isFormOpen}
    />
    {isFormOpen ? (
      <PetForm 
      handleAddPet={handleAddPet} 
      selected={selected} 
      handleUpdatePet={handleUpdatePet}
      />
    ) : (
      <PetDetails 
      selected={selected} 
      handleFormView={handleFormView} 
      handleDeletePet={handleDeletePet} 
      />
    )}
  </>
  )
};

export default App;