const router = require('express').Router();
const knex = require('knex');

// this configuration object teaches knex hot to find the database and what driver to use.
const knexConfig = {
  client: 'sqlite3', // the npm/yarn module we installed
  useNullAsDefault: true, // needed when working with SQLite3
  connection: {
    // relative to the file folder
    filename: './data/rolex.db3'
  }
}

const db =knex(knexConfig);

router.get('/', (req, res) => {
  // get the roles from the database
  db('roles')
    .then(roles => {
      res.status(200).json(roles)
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

// remember to get rid of the array brackets by adding first()
router.get('/:id', (req, res) => {
  // retrieve a role by id
  db('roles')
    .where({id: req.params.id})
    .first() // or you can reference array at first location, first() has same effect
    .then(role => {
      if(role) {
        res.status(200).json(role)
      } else {
        res.status(404).json({ message: 'Rold Id not found' })
      }
    }).catch(err => {
      res.status(500).json(err)
    })
});

router.post('/', (req, res) => {
  // add a role to the database
   db('roles')
    .insert(req.body)
    .then(role => {
      const [id] = role;

      db('roles')
        .where({ id })
        .first()
        .then(role => {
          res.status(200).json(role)
        })
    })
    .catch(err => {
      res.status(500).json(err)
    })
});


// put 1.a
// router.put('/:id', (req, res) => {
//   // update roles
//  const changes = req.body;
//  const { id } = req.params;

//  db('roles')
//   .where({ id: id }) //or .where({id: req.params.id})^^
//   .update(changes) //or req.body^^
//   .then(count => {
//     res.status(200).json(count)
//   })
//   .catch(err => {
//     res.status(500).json(err)
//   })
// });


// put 1.b
router.put('/:id', (req, res) => {

  db('roles')
    .where({id: req.params.id})
    .update(req.body)
    .then(count => {
      if(count > 0) {
        db('roles')
        .where({id: req.params.id})
        .first()
        .then(role => {
          res.status(200).json(role)
        })
      }else {
        res.status(404).json({message: 'role not found'})
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

//1.a
// router.delete('/:id', (req, res) => {
//   // remove roles (inactivate the role)
//   const { id } = req.params;

//   db('roles')
//     .where({ id })
//     .del()
//     .then(count => {
//       res.status(200).json(count)
//     })
//     .catch(err => {
//       res.status(500).json(err);
//     })
// });


//1.b
router.delete('/:id', (req, res) => {
  db('roles')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Role ID not Fount' });
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

module.exports = router;
