// src/components/Column.js
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({ column, tasks }) => {
  return (
    <div className="flex-1 p-4 bg-gray-100 rounded-md ml-4  ">
      <h3 className="text-lg font-semibold mb-4 ">{column.title}</h3>
      <Droppable droppableId={column.id} key={column.id}>
        {(provided) => (
          <div
            className="flex flex-col   "
            style={{ minHeight: "65vh" }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
