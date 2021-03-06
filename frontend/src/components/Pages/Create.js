import React, { useState } from "react";
import '../../App.css';
import HabitList from '../HabitList';
import '../Cards.css';

export default function Create() {
  return (
    <div className="Create">
      <h1>Select your preferences</h1>
      <h1>Cuisines</h1>
      <h1>Food Types</h1>
      <HabitList />
    </div>
  );
}
