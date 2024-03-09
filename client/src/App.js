import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';


console.log("working till app.js");

const GET_USERS = gql`
  query {
    users {
      id
      name
      age
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $email: String!) {
    createUser(name: $name, age: $age, email: $email) {
      id
      name
      age
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
      age
      email
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleCreateUser = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("event = " , event);

    const name = event.target.elements.Name.value;
    const age =  parseInt(event.target.elements.Age.value);
    const email = event.target.elements.Email.value;
    
    await createUser({
      variables: { name, age, email },
      refetchQueries: [{ query: GET_USERS }]
    });
  };

  const handleDeleteUser = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("event= " , event);
    const id = event.target.elements.Id.value;
    await deleteUser({
      variables: { id },
      refetchQueries: [{ query: GET_USERS }]
    });
  };
  const handleAlsoDeleteUser = async (id) => {
    try {
      // Delete the user and update the cache manually
      await deleteUser({
        variables: { id },
        update: (cache) => {
          const existingUsers = cache.readQuery({ query: GET_USERS });
          const newUsers = existingUsers.users.filter((user) => user.id !== id);
  
          cache.writeQuery({
            query: GET_USERS,
            data: { users: newUsers },
          });
        },
      });
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>

<form onSubmit={handleCreateUser}>
<div className='flex flex-row items-center mx-6 m-20 justify-around border-2 rounded border-spacing-2 border-gray-300 p-5 mx-18'>
<div>
  <p className='text-lg font-normal'> Add a New User:</p>
  </div>

  <label
  htmlFor="Name"
  className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <input
    type="text"
    id="Name"
    className="peer border-none h-10 bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
    placeholder="Name"
  />

  <span
    className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
  >
    Name
  </span>
</label>

<label
  htmlFor="Age"
  className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <input
    type="text"
    id="Age"
    className="peer border-none h-10 bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
    placeholder="Age"
  />

  <span
    className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
  >
    Age
  </span>
</label>


<label
  htmlFor="Email"
  className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <input
    type="text"
    id="Email"
    className="peer border-none h-10 bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
    placeholder="Email"
  />

  <span
    className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
  >
    Email
  </span>
</label>

<button

type='Submit'
            className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Add User
          </button>

</div>

</form>

<form  onSubmit={handleDeleteUser}>


<div className='flex flex-row items-center mx-6 m-20 justify-around border-2 rounded border-spacing-2 border-gray-300 p-5 mx-18'>
<div className='flex flex-row'>
  <p className='text-lg font-normal mr-5 items-center'> Delete a User:</p>
  <label
  htmlFor="Id"
  className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <input
    type="text"
    id="Id"
    className="peer border-none  h-10 bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
    placeholder="Id"
  />

  <span
    className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
  >
    Id
  </span>
</label>


    </div>

<button
            type='Submit'
            
            className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Delete User
          </button>

</div>
</form>

<div className="overflow-x-auto">
  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
    <thead className="ltr:text-left rtl:text-right">
      <tr>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Age</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
        <th className="px-4 py-2"></th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
    {data.users.slice().reverse().map((user) => (
      <tr>
        <td className="whitespace-nowrap text-center px-4 py-2 font-medium text-gray-900">{user.name}</td>
        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700">{user.age}</td>
        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700">{user.id}</td>
        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700">{user.email}</td>
        <td className="whitespace-nowrap text-center px-4 py-2">
          <button
            onClick={() => handleAlsoDeleteUser(user.id)}
            className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Delete
          </button>
        </td>
      </tr>
         ))}
    </tbody>
  </table>
</div>


    
    </div>
  );
}

export default App;
