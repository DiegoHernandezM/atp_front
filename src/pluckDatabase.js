import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataStudent } from "./redux/slices/dashboard";
import { getSubjects } from "./redux/slices/subjects";
import { getUserTests } from "./redux/slices/usertests";
import { getQuestionsPreload } from "./redux/slices/questions";
import { getLoggedUser } from "./redux/slices/users";
import { db } from "./database";

function useBulkData() {
  const dispatch = useDispatch();
  const { isOnline } = useSelector((state) => state.onlinestatus);

  useEffect(() => {
    if (isOnline) {
      const requestedVersion = 40;

      let dbRequest = indexedDB.open('myDatabase');

      dbRequest.onsuccess = function(event) {
        let db = event.target.result;
        if (db.version < requestedVersion) {
          console.log(`Base de datos con versión ${db.version}. Eliminando y actualizando...`);
          db.close();
          indexedDB.deleteDatabase('myDatabase').onsuccess = function() {
            console.log('Base de datos eliminada exitosamente.');
            // Continuar con el vaciado y las operaciones posteriores
            proceedWithPreloading();
          };
        } else {
          console.log(`Base de datos abierta con éxito con la versión ${db.version}.`);
          // Si la versión es correcta, continuar directamente con el vaciado
          proceedWithPreloading();
        }
      };

      dbRequest.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.error);
      };
    }
    function proceedWithPreloading() {
      dispatch(getUserTests()).then((data) => {
        preloadUserTest(data);
      });
      dispatch(getSubjects(false)).then((data) => {
        preloadSubjects(data);
      });
      dispatch(getLoggedUser(false)).then((data) => {
        preloadUser(data);
      });
      dispatch(getQuestionsPreload()).then((data) => {
        preloadQuestions(data.data);
      });
      dispatch(getDataStudent()).then((data) => {
        preloadDashboard(data);
      });
    }
  }, [isOnline]);
}

const preloadQuestions = async (questions) => {
  await db.questions.bulkPut(questions);

  questions.forEach(async (q) => {
    if (q.image !== null) {
      try {
        const response = await fetch(
          "https://aviationimages.s3.amazonaws.com/" + q.image
        );
        const newBlob = await response.blob();

        // Update the record in the database
        db.questions.update(q.id, { image: q.image, blob: newBlob });
      } catch (error) {
        console.error(error);
      }
    }
  });
};

const preloadSubjects = async (sub) => {
  await db.subjects.bulkPut(sub);
};

const preloadUserTest = async (info) => {
  await db.infotest.bulkPut(info);
};

const preloadDashboard = async (info) => {
  await db.dashboard.toArray().then((result) => {
    if (result.length === 0) {
      db.dashboard.add(info);
    }
  });
};

const preloadUser = async (us) => {
  if (us && (typeof us.id === "string" || typeof us.id === "number")) {
    try {
      const existingItem = await db.user.where("id").equals(us.id).first();
      if (!existingItem) {
        await db.user.add(us);
      }
    } catch (error) {
      console.error("Error al pre-cargar datos de usuario:", error);
    }
  } else {
    console.warn("Datos de usuario no válidos para pre-cargar.");
  }
};

export default useBulkData;
