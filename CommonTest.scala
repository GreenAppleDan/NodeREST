package ru.infocrypt.megacert

import java.util.Calendar

import org.scalatest._
import ru.infocrypt.megacert.model.Certificate.CertificateNumber
import ru.infocrypt.megacert.model.logging.{Event, MegaCertEventLog}
import ru.infocrypt.megacert.model.{OrgType, _}
import ru.infocrypt.megacert.sqlquery.{ComplexQueries, ParamForFind}

/**
 * Функционал CommonElements.scala
 */
class CommonTest extends FlatSpec {

    //model.initModel()
    
    lazy val AnyPerson = anyObject[Person](Person)
    lazy val AnyCryptoNet = anyObject[CryptoNet](CryptoNet)

    info("************* Common Elements Testing *******************************")

    "build log for changed fields" must "work" ignore {

        def getLastEv =
            getLastEvent( Event.ChangeObject, AnyPerson.id, ObjectType.Person ).
              getOrElse( fail( "Нет записи в журнале об изменениях" ) )
        withOutSaveInDB {

            val oldSn = AnyPerson.surname.get.getOrElse("nullsurname")
            val newVal = oldSn + "ChangeTest"
            AnyPerson.surname(newVal).update()

            val ev = getLastEv

            val rusNameField = Person.transalateFieldName(Person.surname)

            val dscr = ev.description.get.getOrElse(fail("Нет описания изменений (description) в журнале "))
            val regStr = ".*" + rusNameField + ".*" + oldSn + ".*->.*" + newVal + ".*"

            assert(dscr.matches(regStr), dscr + " NOT MATCHES " + regStr)

            AnyPerson.surname(None).update()

            val ev2 = getLastEv
            val dscr2 = ev2.description.get.getOrElse(fail("Нет описания изменений (description) в журнале "))
            val regStr2 = ".*" + rusNameField + ".*" + oldSn + ".*->.*NULL.*"

            assert(dscr2.matches(regStr2), dscr2 + " NOT MATCHES " + regStr2)

        }

    }

    "Changing some fields" must "logging" ignore {

        if(
            CryptoNet.fieldsToMonitoringChanges.contains( CryptoNet.code ) &&
              CryptoNet.fieldsToMonitoringChanges.contains( CryptoNet.note )
        ) {

            withOutSaveInDB {

                val lastLogId = getLastEvent(Event.ChangeObject, AnyCryptoNet.id, ObjectType.CryptoNet).map(_.id)

                val realCode = AnyCryptoNet.code.get
                val realNote = AnyCryptoNet.note.get.getOrElse("")

                val newCode = "0000"
                val newNote = realNote + "_testLog"
                val description = "Основание: Указ президента РФ"

                CryptoNet.update(
                    AnyCryptoNet.code(newCode).note(newNote), true, description
                )

                val eLogs = getLastEvents(Event.ChangeObject, AnyCryptoNet.id, 2, ObjectType.CryptoNet)

                assert( !eLogs.exists(_.id == lastLogId.getOrElse(-1)), "Не добавилось двух записей изменений в журнал")

                assert( // Проверка по полю NOTE
                    eLogs.exists( el =>
                        el.fieldName.get.getOrElse("") == CryptoNet.transalateFieldName( CryptoNet.note ) &&
                        el.newValue.get.getOrElse("") == newNote && el.oldValue.get.getOrElse("") == realNote &&
                        el.description.get.getOrElse("") ==  description
                    )
                )

                assert( // Проверка по полю CODE
                    eLogs.exists( el =>
                        el.fieldName.get.getOrElse("") == CryptoNet.transalateFieldName( CryptoNet.code ) &&
                          el.newValue.get.getOrElse("") == newCode && el.oldValue.get.getOrElse("") == realCode &&
                          el.description.get.getOrElse("") ==  description
                    )
                )

                CryptoNet.update(
                    AnyCryptoNet.code("yyy").note("note"), false
                )

                // Проверяем, что лог об изменениях не пишется в журнал, если это не нужно
                val eLogsLast = getLastEvents(Event.ChangeObject, AnyCryptoNet.id, 2, ObjectType.CryptoNet)
                assert( eLogsLast.map( _.id ) == eLogs.map( _.id ) )

            }

        } else info( " test Changing some fields must logging IS DISABLING because NOTE or CODE not in FIELDSTOMONITORINGCHANGES" )

    }

    "Insert Organizations for reserve " must " be fast" ignore {

            withOutSaveInDB {
                calcTime({
                    val currentOrg = Organization.findByCode("40TB")
                    val departmentID = Some(anyObject[Department](Department).id)
                    val curTransport = anyObject[Transport](Transport)
                    val testOrgName = "TEST"
                    val freeValue = (1 to 1000).toList

                    freeValue.map(currentNumber => {
                        calcTime({

                            val newRecord =
                                calcTime({
                                     Organization.createRecord.
                                      code( Organization.getNextCode(OrgType.Storon)).
                                      name(testOrgName + currentNumber.toString).
                                      organizationID(currentOrg.get.id).registered(Calendar.getInstance())
                                }, "getNextCode").reslt

                            if (curTransport.id > 0)
                                newRecord.transportID(curTransport.id)

                            val addOrg =  Organization.insert(newRecord)


                            if (!departmentID.isEmpty && !departmentID.equals("undefined") && !departmentID.equals("null")) {
                                SuperviseDepartment.associate(addOrg.get.id, departmentID.get, isPrimary = true)
                            }

                        }, currentNumber.toString)
                    })
                    }, " all 1000"
                )

            }
            // 323, 58, 22, 26, 38, 26 ... 426, 429, 409
            // 50, 15, 24, 17, 21, 22, 25 ...

    }

    "Check next CertNumber" must " be properly" ignore {

        withOutSaveInDB {

            val curOrg = Organization.findByParams( Nil, Nil, (0,1) ).head

            def checkNextNumber( lastNumber: String, mustNextNumber : String ) = {
                ComplexQueries.updateSavedBicrIdents( curOrg.id, lastNumber )
                val nextNumb = Certificate.getSerialNumber( curOrg )
                println( " _ _ got _ _ " + nextNumb + " _ _ _ must _ _ _ " +  mustNextNumber )
                assert( nextNumb == mustNextNumber )
            }

            // 00009 -> 00010
            checkNextNumber( "00009", "0010" )
            // 09999 -> Z000A
            checkNextNumber( "09999", "000A" )
            // Z000Z -> Z00A0
            checkNextNumber( "Z000Z", "00A0" )
            // Z00AZ -> Z00B0
            checkNextNumber( "Z00AZ", "00B0" )
            // Z0A0Z -> Z0A10
            checkNextNumber( "Z0A0Z", "0A10" )

            // После достижения последнего номера сбрасываем на ноль и пробуем еще (возможно остались пробелы)
            // checkNextNumber( "ZAZZZ", "0001" )

        }
    }

    "IsArchive " must " be ignore in all queries" ignore {

        val list =
          "select 1 from dual where isArchived    =0 and 2 = 2" ::
          "select 1 from dual dd where dd.isArchived   = 0" ::
          "select 1 from dual dd where dd.isArchived=0" ::
          "select 1 from dual dd where (isArchived!=1)" ::
          "select 1 from dual dd where (dd.isArchived=0 and 7 = 7) or 5 = 6" ::
          """select 1
               from dual dd
              where (
                dd.isArchived=0 and 7 = 7
              ) or 5 = 6""" ::
          "select 1 from dual dd where dd.isArchived!=1" ::
          "select 1 from dual dd where dd.isArchived    !=1 " ::
          "select 1 from dual dd where 2 =2 and isArchived    !=1 " :: Nil


        val pattern = """(?i)( |\()([a-z|\.]*isarchived( )*(=|!=)( )*(0|1))""".r

        assert(
            list.forall(
                v => {

                    val sql = ignoreArchivedInWhere(v)
                    val retMatch = sql.toUpperCase.contains("ISARCHIVED")
                    if( !retMatch ) {
                        val conn = Database.getNewConnection
                        val rs = conn.prepareStatement(sql)
                        try {
                            rs.executeQuery() // Проверяем на валидность SQL выраженич
                            true
                        } catch {
                            case e:Throwable =>
                                println( " ========== FAILED EXECUTE SQL ============ " + sql )
                                false
                        } finally {
                            rs.close()
                            Database.releaseConn(conn)
                        }

                    } else {
                        println( " ========== FAILED SQL ============ " + sql )
                        false
                    }
                }) , "Not all sql cut isarchived"
        )
    }

    "Check Person diff " must " work" ignore {

        val t = AnyPerson  // В случае запуска только этого теста инитим схему БД, обращаясь к  AnyPerson

        val testPers = Person.createRecord
        testPers.fillFieldsFromSudirData(false)
        info(" ---------- " + testPers.getDiffFieldsFromSudirData(", ") )
        assert( !testPers.hasDiffWithSudir, "Start vals not match " + testPers.getDiffFieldsFromSudirData(", ") )

        testPers.emailSudir("test@email.ru")
        assert( testPers.hasDiffWithSudir, "Email must have diff " + testPers.getDiffFieldsFromSudirData(", ") )

        testPers.fillFieldsFromSudirData(false)
        assert( !testPers.hasDiffWithSudir, "After fill vals not match " + testPers.getDiffFieldsFromSudirData(", ") )

        val dpLink = DepartmentSudirDepart.findByParams( Nil, Nil, (0,1) ).headOption
        if( dpLink.isEmpty ) info( " ---------- sudir dep link not found" )
        else {
            testPers.departmentidSudir(dpLink.get.sudirGuid.get)
            assert( testPers.hasDiffWithSudir, "Deps must have diff " + testPers.getDiffFieldsFromSudirData(", ") )

            testPers.departmentID( dpLink.get.departmentID.get )
            assert( !testPers.hasDiffWithSudir, "Deps must match " + testPers.getDiffFieldsFromSudirData(", ") )
        }

    }


    "Find by params " must " parameters " ignore {

        info("************* Find by params *******************************")

        withOutSaveInDB {
            Person.findByParams(

                ParamForFind( Person.SNILS, null ) ::
                ParamForFind( Person.SNILS, "09\t87\r65\f4 ', \" 556\0 677" ) :: Nil
            )
        }

        info("************* Find by params end *******************************")

    }




    "Collision " must " throw exception " ignore {
        val sb = new StringBuilder
        try {


            val pk1 = PubKey.findByParams( Nil, Nil, (0,1) ).head
            val pkId = pk1.id
            val pk2 = PubKey.findById(pkId).get

            sb.append(s" ********************************* ${pkId} **********************************************************\n")
            def log(in: String): Unit = {
                sb.append(in)
                sb.append("\n")
            }


            val oldStatus = pk1.status.get

            val newStatus = {
                if (oldStatus == PubKeyStatus.Active) PubKeyStatus.Blocked
                else PubKeyStatus.Active
            }

            log(s" status in BD = ${PubKey.findById(pk2.id).get.status.get}  ")
            pk1.status(newStatus)
            pk2.secondNotificSended(pk2.secondNotificSended.get)

            intercept[UpdateCollisionException] {
                List(pk2 -> "pk2", pk1 -> "pk1").par.foreach(
                    p => {
                        val localSts = p._1.status.get
                        log(p._2 + s". status changed on    ${p._1.status.get} ( $localSts ) ")
                        p._1.update()
                    }
                )
            }

        } finally {
            sb.append(" *******************************************************************************************")
            println(sb.toString())
        }

    }

}
