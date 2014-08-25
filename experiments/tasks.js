/*
1) need way to specify input data types

 - map that identifies available data for an instance

 - but then a task that looks at all data related to 'chunk' (e.g. all studies for a patient) to make them into a new derived object that is 'view'able

 - operations define query that is specific to their requirements, which may be a call back to couchdb or could be another network fetch.

2) need a way to specify operations 

 - list the kind of data chunk data they require

 - list the provenance of the desired result

  -- fill in the blank where unfilled are wildcards and blanks can be filled in by regexp

3) need a way to query for all unsatisfied operations

 - basically becomes a job queue of operations that need to be performed along with the specification of the input data needed to perform them.

 - results of the operation are expressed in the same provenance form so that the job queue is reduced.

4) need changes api wrappers to watch job queues and trigger execution of the required tasks

5) need a way to register that an operation has started to execute

Examples:

- run a thumbnail generator on all image storage classes
-- easier since it can be a map reduce where the map function outputs all instance documents where the SOPClassUID is an image storage but the document does not have image attachments.
-- changes API watcher on that view can run the generator and save the attachment.


- run a volume renderer on each series

-- need to run an agent that creates series documents (SRs?) that have references to all the image instances in that series
-- need a map view that lists all series documents that don't have images attached
-- need a operation to generate images to attach to the series document.


- perform segmentation for each time point in a longitudinal sequence
-- make an agent that generates an SR document refering to each (set of) stud(y/ies) that is a time point of the sequence
-- make a view that lists those documents
-- make an agent that defines a segmentation operation requirement for those documents (can be manual)
-- make an operation that can use registration to map one segmentation to a new timepoint
-- make a view that defines a registration operation for required segmentation that has a previous time point available
-- make an operation that applies the mapping process
-- make an agent that applies the mapping operation to each view item that doesn't yet have a result.



*/
