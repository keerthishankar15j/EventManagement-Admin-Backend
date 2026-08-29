const eventModel = require("../Model/EventModel");


// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = async (data) => {

    return await eventModel.create(data);

};


// =====================================================
// GET ALL EVENTS
// =====================================================

const getEvents = async () => {

    return await eventModel.find();

};


// =====================================================
// GET SINGLE EVENT
// =====================================================

const getEventById = async (id) => {

    return await eventModel.findById(id);

};


// =====================================================
// UPDATE EVENT
// =====================================================

const updateEvent = async (id, data) => {

    return await eventModel.findByIdAndUpdate(

        id,

        data,

        {
            new: true,
            runValidators: true
        }

    );

};


// =====================================================
// DELETE EVENT
// =====================================================

const deleteEvent = async (id) => {

    return await eventModel.findByIdAndDelete(id);

};


module.exports = {

    createEvent,

    getEvents,

    getEventById,

    updateEvent,

    deleteEvent

};