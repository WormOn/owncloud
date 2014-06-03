/**
 * File: LoginTest.java 27.05.2014, 12:44:50, author: mreinhardt
 * 
 * Project: OwnCloud
 *
 * https://www.martinreinhardt-online.de/apps
 */
package de.martinreinhardt.owncloud.webtest.tests;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import net.thucydides.core.annotations.Story;
import net.thucydides.junit.annotations.Concurrent;
import net.thucydides.junit.runners.ThucydidesRunner;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.junit.runner.RunWith;

import com.icegreen.greenmail.user.UserException;

import de.martinreinhardt.owncloud.webtest.RoundCube;
import de.martinreinhardt.owncloud.webtest.util.EmailUserDetails;

/**
 * @author mreinhardt
 * 
 */
@Story(RoundCube.Login.class)
@RunWith(ThucydidesRunner.class)
@Concurrent
public class RoundCubeMailPositiveTest extends RoundCubeMockedMailTest {

	// Logger
	protected static final Logger LOG = Logger
			.getLogger(RoundCubeMailPositiveTest.class);

	public EmailUserDetails getEmailUserDetailsTest() {
		EmailUserDetails userDtls = new EmailUserDetails();
		userDtls.setEmail("positive@roundcube.owncloud.org");
		userDtls.setUsername("positive@roundcube.owncloud.org");
		userDtls.setPassword("42");
		return userDtls;
	}

	@Test
	public void test_roundcube_mail() throws AddressException,
			MessagingException, UserException {
		runEmailTest();
	}

	public void executeTestStepsFrontend() {
		endUserLogin.enter_login_area();
		endUserLogin.do_login("positive@roundcube.owncloud.org", "42");
		loggedInuserSteps.go_to_roundcube_view();
		assertFalse("There should be no error displayed.",
				appSteps.is_showing_errors());
		String subject = appSteps.get_subject_of_first_email();
		LOG.info("Got the following subject: " + subject);
		assertNotNull("Subject of first email shouldn't be empty", subject);
		assertTrue("Subject of first email should be: " + TEST_MAIL_SUBJECT,
				subject.equalsIgnoreCase(TEST_MAIL_SUBJECT));
	}
}
