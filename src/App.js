import React, { useEffect, useState } from "react";
import { VscTrash } from "react-icons/vsc";
import { LiaEdit } from "react-icons/lia";
const getLocalStorage = () => {
  let todos = localStorage.getItem("todos");
  if (todos) {
    return JSON.parse(localStorage.getItem("todos"));
  } else {
    return [];
  }
};
export const App = () => {
  const [name, setName] = useState("");
  const [todos, SetTodos] = useState(getLocalStorage());
  const [status, setStatus] = useState("All");
  const [isEdititng, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(0);
  const handleSumbit = (e) => {
    e.preventDefault();
    if (!name) {
      alert("You must type something");
    } else if (isEdititng) {
      const updaedList = todos.map((item) => {
        if (item.id === editID) {
          return { ...item, title: name };
        } else {
          return item;
        }
      });
      SetTodos([todos, ...updaedList]);
      setName("");
      setEditID(0);
      setIsEditing(false);
    } else {
      const newItem = {
        id: new Date().getTime().toString(),
        title: name,
        isChecked: false,
      };
      SetTodos([...todos, newItem]);
      setName("");
    }
  };
  const removeButton = (id) => {
    const removedItem = todos.filter((ele) => {
      return ele.id !== id;
    });
    SetTodos(removedItem);
  };
  const handleEditing = (id) => {
    const editItem = todos.find((ele) => {
      return ele.id === id;
    });
    setName(editItem.title);
    setEditID(id);
    setIsEditing(true);
  };
  const checkedItem = (item, id) => {
    const newList = todos.map((ele) => {
      const isExist = ele.id === item.id;
      if (isExist) {
        return { ...ele, isChecked: !item.isChecked };
      }
      return ele;
    });
    SetTodos(newList);
  };
  const getStatusList = () => {
    const activeList = todos.filter((item) => {
      return item.isChecked === false;
    });
    const completedList = todos.filter((item) => {
      return item.isChecked === true;
    });
    switch (status) {
      case "Active":
        return activeList;
      case "Completed":
        return completedList;
      default:
        return todos;
    }
  };

  const statusList = ["All", "Active", "Completed"];
  const todosNewList = getStatusList();
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <main className="main-container">
      <h1>#todo</h1>
      <div className="form-container">
        {statusList.map((item, id) => {
          return (
            <div className="btn-container" key={id}>
              <button className="btn" onClick={() => setStatus(item)}>
                {item}
              </button>
            </div>
          );
        })}
      </div>
      <div className="underline"></div>
      <div className="form-container">
        <input
          type="text"
          className="input-info "
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="sumbit-btn" onClick={(e) => handleSumbit(e)}>
          {isEdititng === true ? "Edit" : "Add"}
        </button>
      </div>
      <section className="section-container">
        <div className="list-container ">
          {todosNewList.map((item) => {
            const { title, id, isChecked } = item;
            return (
              <div key={id} className="items-container">
                <div className="text-container">
                  <input
                    className="check-box"
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => checkedItem(item)}
                  />
                  <div className={`${isChecked === true && "text-decoration"}`}>
                    <h4>{title}</h4>
                  </div>
                </div>
                {status === "Completed" && (
                  <div className="remove-container">
                    <button
                      className="remove-btn"
                      onClick={() => removeButton(id)}
                    >
                      <VscTrash />
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditing(id)}
                    >
                      <LiaEdit />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {status === "Completed" && (
          <div className="clear-container">
            <button className="clear-btn" onClick={() => SetTodos([])}>
              Delete all
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
