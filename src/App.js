import { useCallback, useEffect, useState } from "react";
import { BiArchive } from "react-icons/bi";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import Search from "./components/Search";

function App() {
    const [appointmentList, setAppointmentList] = useState([]);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("petName");
    const [orderBy, setOrderBy] = useState("asc");

    const fetchData = useCallback(() => {
        fetch("./data.json")
            .then((response) => response.json())
            .then((data) => setAppointmentList(data));
    }, []);

    const filteredAppointments = appointmentList
        .filter((appointment) => {
            return (
                appointment.petName.toLowerCase().includes(query) ||
                appointment.ownerName.toLowerCase().includes(query) ||
                appointment.aptNotes.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            let order = orderBy === "asc" ? 1 : -1;
            return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
                ? -1 * order
                : 1 * order;
        });

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const deleteApointment = (id) =>
        setAppointmentList(
            appointmentList.filter((appointment) => appointment.id !== id)
        );

    const onClickAddAppointment = (newAppointment) => {
        let updatedAppointmentList = [...appointmentList];
        updatedAppointmentList.push({
            id: appointmentList.length,
            ...newAppointment,
        });
        setAppointmentList(updatedAppointmentList);
    };

    return (
        <div className="App container mx-auto mt-3 font-thin">
            <h1 className="text-5xl mb-3">
                <BiArchive className="inline-block text-red-400 align-top" />
                Your Appointments
            </h1>
            <AddAppointment onClickAddAppointment={onClickAddAppointment} />
            <Search
                setQuery={setQuery}
                query={query}
                sortBy={sortBy}
                setSortBy={setSortBy}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
            />
            <ul className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                    <AppointmentInfo
                        key={appointment.id}
                        deleteApointment={deleteApointment}
                        appointment={appointment}
                    />
                ))}
            </ul>
        </div>
    );
}

export default App;
