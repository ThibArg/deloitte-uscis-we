/*
 * (C) Copyright 2014 Nuxeo SA (http://nuxeo.com/) and others.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * Contributors:
 *     thibaud
 */

package org.nuxeo.deloitte;

import java.text.SimpleDateFormat;
import java.util.GregorianCalendar;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.rest.DocumentFactory;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.ModuleRoot;


/**
 * The root entry for the WebEngine module.
 * @author Thibaud Arguillere
 */
@Path("/uscisform")
@Produces("text/html;charset=UTF-8")
@WebObject(type="DeloitteRoot")
public class DeloitteRoot extends ModuleRoot {

    private static final Log log = LogFactory.getLog(DeloitteRoot.class);

    @GET
    public Object doGet() {

        // Get the user
        ctx.setProperty("currentUser", ctx.getPrincipal().getName());
        // get the applicant_data doc
        DocumentModel theDoc = getApplicantDataDoc();
        // Update some specific values
        ctx.setProperty("spouseDateOfBirthMMDDYYYY", "");
        if(theDoc != null) {
            GregorianCalendar theDate = (GregorianCalendar) theDoc.getPropertyValue("ad:spouseDateOfBirth");
            if(theDate != null) {
                SimpleDateFormat mmddyy = new SimpleDateFormat("MM/dd/yyyy");
                ctx.setProperty("spouseDateOfBirthMMDDYYYY", mmddyy.format(theDate.getTime()));
            }
        }
        return getView("index").arg("Document", DocumentFactory.newDocument(ctx, theDoc));
    }

    @Override
    protected void initialize(Object... arg) {
/*
        DocumentModel theDoc = getApplicantDataDoc();

        ctx.setProperty("found", false);
        ctx.setProperty("docUid", "");
        if(theDoc != null) {
            ctx.setProperty("found", true);
            ctx.setProperty("docUid",theDoc.getId());
        }
*/
    }

    protected DocumentModel getApplicantDataDoc() {
        DocumentModel theDoc = null;
        CoreSession session = ctx.getCoreSession();

        String currentUser = session.getPrincipal().getName();
        ctx.setProperty("currentUser", currentUser);

        DocumentModelList docs = session.query("SELECT * FROM applicant_data WHERE ad:user ='" + currentUser + "'");
        if(docs.size() > 0) {
            theDoc = docs.get(0);
        }

        return theDoc;
    }
}
