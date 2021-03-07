import React, { useState } from "react";
import '../../App.css';
import HabitList from '../HabitList';
import '../Cards.css';
import cuisines from '../assets/data/cuisine-js.json'
import types from '../assets/data/type-js.json'

export default function Create() {
  return (
    <div className="Create">
      <h1>Cuisines</h1>
      <HabitList />
      <h1>Food Types</h1>
      <HabitList />
    </div>
  );
}
